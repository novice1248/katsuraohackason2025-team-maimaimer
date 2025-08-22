import { type Item } from '../../Admin/ItemAdmin/ItemAdmin';
import { Input } from '../../Input/Input';
import { Checkbox } from '../../Checkbox/Checkbox';

// このコンポーネントが受け取るpropsの型を定義
interface FormFieldProps {
  item: Item;
  value: string | boolean;
  error: string;
  detail: string;
  onValueChange: (item: Item, value: string | boolean) => void;
  onDetailChange: (item: Item, detailValue: string) => void;
}

/**
 * データ入力フォームの各項目を描画するUIコンポーネント
 */
export const FormField = ({ item, value, error, detail, onValueChange, onDetailChange }: FormFieldProps) => {
  return (
    <div className="form-item-wrapper">
      <div className="form-item">
        {item.type === 'number' ? (
          <Input
            id={item.id}
            label={item.label}
            type="number"
            value={(value as string) || ''}
            onChange={e => onValueChange(item, e.target.value)}
            error={error}
          />
        ) : (
          <Checkbox
            label={item.label}
            checked={(value as boolean) ?? false}
            onChange={e => onValueChange(item, e.target.checked)}
          />
        )}
      </div>
      {item.type === 'checkbox' && !(value ?? false) && (
        <div className="form-item-details">
          <Input
            id={`${item.id}-details`}
            label="エラー詳細"
            type="text"
            value={detail || ''}
            onChange={e => onDetailChange(item, e.target.value)}
            error={error}
          />
        </div>
      )}
    </div>
  );
};
