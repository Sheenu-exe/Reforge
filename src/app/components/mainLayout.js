import DockDemo from "./dock";

const MainLayout = ({children}) => {
    return (
        <div className="flex flex-col min-h-screen relative">
            <div className="flex-1">
                {children}
            </div>
            <div className="h-[0vh] w-full bottom-7 sm:bottom-7 md:bottom-12 fixed"><DockDemo /></div>
        </div>
    );
}

export default MainLayout;