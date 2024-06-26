import useDataProvider from "@/hooks/useDataProvider";
import Form1 from "../form/Form1";
import Form2 from "../form/Form2";
import Form3 from "../form/Form3";
import Form4 from "../form/Form4";
import Form5 from "../form/Form5";

interface FormProps {
  handlePreviousPage: () => void;
}
const Form = ({handlePreviousPage}:FormProps) => {
  const { page } = useDataProvider();

  if (page === 1) {
    return <Form1 />;
  } else if (page === 2) {
    return <Form2 />;
  } else if (page === 3) {
    return <Form3 />;
  } else if (page === 4) {
    return <Form4 />;
  } else if (page === 5) {
    return <Form5 handlePreviousPage = {handlePreviousPage}  />;
  }
};
export default Form;
