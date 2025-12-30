import { Link } from "react-router";

const WelcomePage = () => {
    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 sm:pb-16 text-center pt-8 sm:pt-12">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-300 mb-4 sm:mb-6">
                Welcome to <span className="text-primary">NoteBase</span>
            </h1>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl text-gray-400 font-extrabold tracking-tight py-4 sm:py-6 lg:py-8 text-gradient-muted leading-tight">
                Unleash the power of<br className="hidden sm:block" /> <span className="text-primary">intuitive thoughts</span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-300 mb-3 sm:mb-4 px-2">Organize your thoughts, ideas, and projects — all in one secure place.</p>
            <p className="text-base sm:text-lg md:text-xl text-gray-400 mt-4 sm:mt-6 px-2">
                <Link className="text-primary-content hover:text-primary duration-300 font-medium underline underline-offset-4" to={"/signup"}>
                    Sign up
                </Link>{" "}
                or{" "}
                <Link className="text-primary-content hover:text-primary duration-300 font-medium underline underline-offset-4" to={"/login"}>
                    log in
                </Link>{" "}
                to start creating notes instantly.
            </p>
        </div>
    );
};

export default WelcomePage;
