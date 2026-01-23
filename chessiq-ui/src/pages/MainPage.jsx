import { Avatar } from "../components/avatar";
import {
  Navbar,
  NavbarSection,
  NavbarItem,
  NavbarLabel,
  NavbarDivider,
} from "../components/navbar";
import { Sidebar } from "../components/sidebar";
import { StackedLayout } from "../components/stacked-layout";
import { Outlet } from "react-router-dom";
import { useLocation, useNavigate } from "react-router-dom";
import ChessIQLogo from "../assets/ChessIQLogo.svg";

function MainPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { label: "Analysis", url: "/mainpage/upload" },
    { label: "Game Archive", url: "/mainpage/games" },
    { label: "Dashboard", url: "/mainpage/dashboard" },
    { label: "Training Plans", url: "/mainpage/training" },
  ];
  return (
    <StackedLayout
      navbar={
        <Navbar>
          <Avatar src={ChessIQLogo} className="w-12 h-12" />
          <NavbarLabel className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            ChessIQ
          </NavbarLabel>
          <NavbarDivider className="max-lg:hidden" />
          <NavbarSection className="max-lg:hidden">
            {navItems.map(({ label, url }) => {
              const isActive = location.pathname === url;
              return (
                <NavbarItem
                  key={label}
                  current={isActive}
                  onClick={() => navigate(url)}
                >
                  {label}
                </NavbarItem>
              );
            })}
          </NavbarSection>
        </Navbar>
      }
      sidebar={<Sidebar />}
    >
      <Outlet />
    </StackedLayout>
  );
}
export default MainPage;
