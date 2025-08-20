import * as functions from "firebase-functions/v1"; // v1を明示的にインポート
import * as admin from "firebase-admin";

admin.initializeApp();

/**
 * 指定したメールアドレスのユーザーに管理者権限を付与する。
 * この関数は、呼び出し元がすでに管理者であるか、
 * もしくはプロジェクトのオーナーである場合にのみ成功します。
 * @param {string} email - 管理者権限を付与したいユーザーのメールアドレス
 */
export const addAdminRole = functions
  .region("asia-northeast1") // 東京リージョンを指定
  .https.onCall(async (data: { email: string }, context: functions.https.CallableContext) => { // dataとcontextに型を定義
    // 認証済みのユーザーからの呼び出しかをチェック
    if (!context.auth) {
      throw new functions.https.HttpsError(
        "unauthenticated",
        "この機能は認証されたユーザーのみが利用できます。",
      );
    }
    
    const email = data.email;
    try {
      // メールアドレスからユーザー情報を取得
      const user = await admin.auth().getUserByEmail(email);
      // ユーザーにカスタムクレームを設定
      await admin.auth().setCustomUserClaims(user.uid, { admin: true });
      
      return {
        message: `${email}に管理者権限を付与しました。`,
      };
    } catch (error) {
      console.error("管理者権限の付与に失敗しました:", error);
      throw new functions.https.HttpsError(
        "internal",
        "管理者権限の付与に失敗しました。",
      );
    }
  });

/**
 * 新しいユーザーが作成されたときに、Firestoreにユーザー情報を保存する
 */
export const createUserDocument = functions
  .region("asia-northeast1")
  .auth.user().onCreate((user: admin.auth.UserRecord) => { // userに型を定義
    const { uid, email, displayName } = user;

    // Firestoreの'users'コレクションにドキュメントを作成
    return admin.firestore().collection("users").doc(uid).set({
      email,
      displayName: displayName || "",
      role: "user", // デフォルトは一般ユーザー
      isApproved: false, // デフォルトは未承認
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  });
