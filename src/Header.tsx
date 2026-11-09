import './Header.css'

export default function Header(){
    const handleClick = (event) => {
        console.log("called")
    }

    return (
        <header>
            <p>User 2084</p>
            <h1 className='website-name'>Mnemosyne system</h1>
            <p onClick={handleClick} style={{cursor: 'pointer'}}>History</p>
        </header>
    )
}