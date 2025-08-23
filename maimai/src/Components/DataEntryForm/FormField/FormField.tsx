import { type Item } from '../../Admin/ItemAdmin/ItemAdmin';
import { Input } from '../../Input/Input';
import { Checkbox } from '../../Checkbox/Checkbox';

interface FormFieldProps {
  item: Item;
  value: string | boolean;
  error: string;
  warning: string;
  detail: string;
  onValueChange: (item: Item, value: string | boolean) => void;
  onDetailChange: (item: Item, detailValue: string) => void;
}

export const FormField = ({ item, value, error, warning, detail, onValueChange, onDetailChange }: FormFieldProps) => {
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
            warning={warning}
            // --- ここから追加・変更 ---
            placeholder={typeof item.standardValue === 'number' ? String(item.standardValue) : '数値を入力'}
            standardValue={item.standardValue}
            errorThreshold={item.errorThreshold}
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
            warning={warning}
          />
        </div>
      )}
    </div>
  );
};
