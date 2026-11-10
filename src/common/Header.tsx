import './Header.css'

interface HeaderProps {
  onHistoryClick: () => void;
}

export default function Header({ onHistoryClick }: HeaderProps){
    return (
        <header>
            <p>User 2084</p>
            <h1 className='website-name'>Mnemosyne system</h1>
            <p onClick={() => onHistoryClick()} style={{cursor: 'pointer'}}>History</p>
        </header>
    )
}