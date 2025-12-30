import { Link } from "react-router";

const WelcomePage = () => {
    return (
        <div className="max-w-11/12 mx-auto">
            <h1 className="xl:text-5xl md:text-4xl text-lg font-bold text-center text-gray-300">
                Welcome to <span className="">NoteBase</span>
            </h1>
            <h1 className="text-center xl:text-8xl lg:text-7xl md:text-6xl text-4xl text-gray-400 font-extrabold tracking-tight py-4 text-gradient-muted">
                Unleash the power of<br></br> <span className="text-primary">intuitive thoughts</span>
            </h1>
            <p className="text-md md:text-xl text-center text-gray-300">Organize your thoughts, ideas, and projects — all in one secure place.</p>
            <p className="text-md md:text-xl text-center text-gray-400">
                <Link className="text-primary-content hover:text-primary duration-200" to={"/signup"}>
                    Sign up
                </Link>{" "}
                or{" "}
                <Link className="text-primary-content hover:text-primary duration-200" to={"/signup"}>
                    log in
                </Link>{" "}
                to start creating notes instantly.
            </p>
        </div>
    );
};

export default WelcomePage;
