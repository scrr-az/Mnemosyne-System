import './Header.css'

export default function Header(){
    const handleClick = (event) => {
        event.preventDefault();
        console.log("called")
    }

    return (
        <header>
            <p>User 2084</p>
            <h1 className='website-name'>Mnemosyne system</h1>
            <a onClick={handleClick} href='.'>History</a>
        </header>
    )
}