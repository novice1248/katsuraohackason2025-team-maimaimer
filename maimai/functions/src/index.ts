import * as functions from "firebase-functions/v1";
import * as admin from "firebase-admin";
import axios from "axios";

admin.initializeApp();

/**
 * 1. 指定したメールアドレスのユーザーに管理者権限を付与する
 */
export const addAdminRole = functions
  .region("asia-northeast1")
  .https.onCall(async (data: { email: string }, context) => {
    if (!context.auth?.token.admin) {
      throw new functions.https.HttpsError("permission-denied", "管理者権限が必要です。");
    }
    try {
      const user = await admin.auth().getUserByEmail(data.email);
      await admin.auth().setCustomUserClaims(user.uid, { admin: true });
      return { message: `${data.email}に管理者権限を付与しました。` };
    } catch (error) {
      console.error("addAdminRole Error:", error);
      throw new functions.https.HttpsError("internal", "処理に失敗しました。");
    }
  });

/**
 * 2. 新しいユーザーが作成されたときに、Firestoreにユーザー情報を保存する
 */
export const createUserDocument = functions
  .region("asia-northeast1")
  .auth.user().onCreate((user) => {
    const { uid, email, displayName } = user;
    return admin.firestore().collection("users").doc(uid).set({
      email,
      displayName: displayName || "",
      role: "user",
      isApproved: false,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  });

/**
 * 3. 指定したメールアドレスのユーザーから管理者権限を削除する
 */
export const removeAdminRole = functions
  .region("asia-northeast1")
  .https.onCall(async (data: { email: string }, context) => {
    if (!context.auth?.token.admin) {
      throw new functions.https.HttpsError("permission-denied", "管理者権限が必要です。");
    }
    try {
      const user = await admin.auth().getUserByEmail(data.email);
      await admin.auth().setCustomUserClaims(user.uid, { admin: false });
      return { message: `${data.email}から管理者権限を削除しました。` };
    } catch (error) {
      console.error("removeAdminRole Error:", error);
      throw new functions.https.HttpsError("internal", "処理に失敗しました。");
    }
  });

/**
 * 4. ユーザーの承認状態を切り替える (デバッグ強化版)
 */
export const toggleUserApproval = functions
  .region("asia-northeast1")
  .https.onCall(async (data: { uid: string; isApproved: boolean }, context) => {
    if (!context.auth?.token.admin) {
      throw new functions.https.HttpsError("permission-denied", "管理者権限が必要です。");
    }
    try {
      const userRef = admin.firestore().collection("users").doc(data.uid);
      await userRef.set({ isApproved: data.isApproved }, { merge: true });
      return { message: `ユーザーの承認状態を${data.isApproved ? "承認済み" : "未認証"}に変更しました。` };
    } catch (error) {
      // エラーの詳細をFirebaseのログに出力
      console.error("toggleUserApproval Error:", error);
      throw new functions.https.HttpsError("internal", "ユーザー承認状態の更新に失敗しました。");
    }
  });

/**
 * 5. 登録されている全ユーザーの一覧を取得する (承認状態も含む)
 */
export const getAllUsers = functions
  .region("asia-northeast1")
  .https.onCall(async (data, context) => {
    if (!context.auth?.token.admin) {
      throw new functions.https.HttpsError("permission-denied", "管理者権限が必要です。");
    }
    try {
      const listUsersResult = await admin.auth().listUsers();
      const authUsers = listUsersResult.users.map((user) => ({
        uid: user.uid,
        email: user.email,
        isAdmin: user.customClaims?.admin === true,
      }));

      const usersCollection = await admin.firestore().collection("users").get();
      const firestoreUsers = new Map();
      usersCollection.forEach(doc => {
        firestoreUsers.set(doc.id, doc.data());
      });

      const combinedUsers = authUsers.map(user => {
        const firestoreData = firestoreUsers.get(user.uid);
        return {
          ...user,
          isApproved: firestoreData?.isApproved || false,
        };
      });

      return combinedUsers;
    } catch (error) {
      console.error("getAllUsers Error:", error);
      throw new functions.https.HttpsError("internal", "ユーザーの取得に失敗しました。");
    }
  });

  /**
 * 6. 'reports'コレクションに新しいドキュメントが作成されたら、GASにデータを送信する
 */
export const sendReportToGAS = functions
  .region("asia-northeast1")
  .firestore
  .document("reports/{reportId}") // ★ここに監視したいコレクション名とドキュメントIDを指定します
  .onCreate(async (snap, context) => {
    // 作成されたドキュメントのデータを取得
    const newReportData = snap.data();
    functions.logger.log("New report created, sending to GAS:", newReportData);

    // GASのWebアプリURLを環境変数から取得
    // 事前に `firebase functions:config:set gas.url="YOUR_GAS_WEB_APP_URL"` で設定しておく
    const gasWebAppUrl = functions.config().gas.url;

    if (!gasWebAppUrl) {
      functions.logger.error("GAS Web App URL is not configured. Please set it in Firebase config.");
      return null; // URLがなければ処理を終了
    }

    try {
      // axiosを使ってGASにPOSTリクエストを送信
      const response = await axios.post(gasWebAppUrl, newReportData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      functions.logger.info("Successfully sent data to GAS. Response:", response.data);
      return { status: "success", message: "Data sent to GAS." };
    } catch (error) {
      // エラーログを詳細に出力
      if (axios.isAxiosError(error)) {
        functions.logger.error("Axios error sending data to GAS:", {
          message: error.message,
          url: gasWebAppUrl,
          response: error.response?.data,
        });
      } else {
        functions.logger.error("Unknown error sending data to GAS:", error);
      }
      return null; // エラーで処理を終了
    }
  });