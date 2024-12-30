// mainLayout.js
import DockDemo from "./dock";

const MainLayout = ({children}) => {
    return (
        <div className="flex flex-col min-h-screen relative">
            <div className="flex-1">
                {children}
            </div>
            <div className="h-[10vh] w-full sticky bottom-0"><DockDemo /></div>
        </div>
    );
}

export default MainLayout;