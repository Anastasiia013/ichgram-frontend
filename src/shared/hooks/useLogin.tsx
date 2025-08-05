import { useSelector } from "react-redux";
import { selectAuthUser } from "../../redux/auth/auth-selectors";

const useLogin = (): boolean => {
  const user = useSelector(selectAuthUser);
  return Boolean(user);
};

export default useLogin;
