const LoginForm = ({
    handleSubmit,
    handleUsernameChange,
    handlePasswordChange,
    username,
    password
}) => {
    return (
        <div>
            <h2>Login</h2>

            <form onSubmit={handleSubmit}>
                <div>
                <label>Username:</label>
                <input 
                    type="text"
                    name="username"
                    value={username}
                    onChange={handleUsernameChange}
                />
                </div>
                <div>
                <label>Password:</label>
                <input 
                    type="password"
                    name="password"
                    value={password}
                    onChange={handlePasswordChange}
                />
                </div>
                <button type="submit">Login</button>
            </form>
        </div>
    )
}

export default LoginForm;