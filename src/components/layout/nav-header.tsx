import CustomerProfile from "../customer/customer-profile";
import TestLogo from "../test/test-logo";

const NavHeader = () => {
  return (
    <div className="flex flex-row items-center px-20 py-5 justify-between">
      <div className="flex flex-row gap-15 items-center">
        <TestLogo />
        <div className="flex flex-row gap-5">
          <a href="#">Home</a>
          <a href="#">Cards</a>
        </div>
      </div>

      <CustomerProfile />
    </div>
  );
};

export default NavHeader;
