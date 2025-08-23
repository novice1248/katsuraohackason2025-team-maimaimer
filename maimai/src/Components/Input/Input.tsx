import "./input.css";

interface InputProps {
    id: string;
    label: string;
    primary?: boolean;
    backgroundColor?: string;
    size?: "small" | "medium" | "large";
    type?: "text" | "email" | "password" | "number";
    placeholder?: string;
    value: string;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    error?: string;
    warning?: string;
    standardValue?: number; // standardValueプロパティを追加
    errorThreshold?: number; // errorThresholdプロパティを追加
}

export const Input = ({
    id,
    label,
    primary = false,
    size = "medium",
    backgroundColor,
    type = "text",
    placeholder,
    value,
    onChange,
    error,
    warning,
    standardValue,
    errorThreshold,
    ...props
}: InputProps) => {
    const mode = primary ? "storybook-input--primary" : "storybook-input--secondary";
    const errorClassName = error ? "storybook-input--error-state" : "";
    const warningClassName = !error && warning ? "storybook-input--warning-state" : "";
    const isNumeric = type === 'number';

    return (
        <div className="input-wrapper">
            <label htmlFor={id} className="input-label">{label}</label>
            <div className="input-container"> {/* inputと基準値表示を囲むコンテナ */}
                <input
                    id={id}
                    type={isNumeric ? 'text' : type}
                    inputMode={isNumeric ? 'numeric' : undefined}
                    pattern={isNumeric ? '[0-9]*' : undefined}
                    placeholder={placeholder}
                    className={[
                        "storybook-input",
                        `storybook-input--${size}`,
                        mode,
                        errorClassName,
                        warningClassName,
                    ].join(" ")}
                    style={backgroundColor ? { backgroundColor } : {}}
                    value={value}
                    onChange={onChange}
                    {...props}
                />
                {/* 基準値と誤差を表示するエリア */}
                {(typeof standardValue === 'number' || typeof errorThreshold === 'number') && (
                    <div className="input-info">
                        {typeof standardValue === 'number' && <span>基準: {standardValue}</span>}
                        {typeof errorThreshold === 'number' && <span>(±{errorThreshold})</span>}
                    </div>
                )}
            </div>
            {error && <p className="storybook-input-error">{error}</p>}
            {!error && warning && <p className="storybook-input-warning">{warning}</p>}
        </div>
    );
};
