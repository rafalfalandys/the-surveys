import { Link, Outlet } from "react-router-dom";
import classes from "./RootLayout.module.scss";

const RootLayout = () => {
  return (
    <div className={classes.mainWrapper}>
      <Link to="/dashboard" className={classes.header}>
        <span>The Surveys!</span>
      </Link>
      <Outlet />
    </div>
  );
};

export default RootLayout;
