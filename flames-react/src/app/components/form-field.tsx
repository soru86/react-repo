const FormField = ({
  fieldLabel,
  fieldName,
  multiSpan = false,
  onChangeHandler,
}: {
  fieldLabel: string;
  fieldName: string;
  multiSpan: boolean;
  onChangeHandler: React.ChangeEventHandler<HTMLInputElement>;
}) => {
  const styleClasses = multiSpan
    ? "h-8 rounded p-1 col-span-3"
    : "h-8 rounded p-1";

  return (
    <>
      <label htmlFor={fieldName} className="font-bold">
        {fieldLabel}
      </label>
      <input
        type="text"
        name={fieldName}
        id={fieldName}
        className={styleClasses}
        onChange={onChangeHandler}
      />
    </>
  );
};

export default FormField;
