// mainLayout.js
import DockDemo from "./dock";

const MainLayout = ({children}) => {
    return (
        <div className="flex flex-col min-h-screen relative">
            <div className="flex-1">
                {children}
            </div>
            <DockDemo />
        </div>
    );
}

export default MainLayout;