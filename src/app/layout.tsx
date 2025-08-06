import React from "react";
import "flag-icons/css/flag-icons.min.css";

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return <>{children}</>;
};
export default RootLayout;
