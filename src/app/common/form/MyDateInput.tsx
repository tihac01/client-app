import { useField } from "formik";
import { Form, Label } from "semantic-ui-react";
import DatePicker from "react-datepicker";

interface Props {
  name: string;
  dateFormat?: string;
  placeholder?: string;
  minDate?: Date;
  maxDate?: Date;
  format?: string;
}

export default function MyDateInput(props: Props) {
  const [field, meta, helpers] = useField(props.name);

  return (
    <Form.Field error={meta.touched && !!meta.error}>
      <DatePicker
        className="mb-3"
        {...field}
        {...props}
        selected={(field.value && new Date(field.value)) || null}
        onChange={(date: Date | null) => {
          helpers.setValue(date);
        }}
        showTimeSelect
        timeCaption="time"
        dateFormat={props.format ? props.format : "d MMM yyyy HH:mm "}
        placeholderText={props.name}
      />
      {meta.touched && meta.error ? (
        <Label basic color="red">
          {meta.error}
        </Label>
      ) : null}
    </Form.Field>
  );
}
