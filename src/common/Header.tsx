import './Header.css'

interface HeaderProps {
  onHistoryClick: () => void;
  isHistoryPage: boolean;
}

export default function Header({ onHistoryClick, isHistoryPage }: HeaderProps){
    return (
        <header>
            <p>User 2084</p>
            <h1 className='website-name'>Mnemosyne system</h1>
            <p onClick={() => onHistoryClick()} style={{cursor: 'pointer'}}>{ isHistoryPage ? "[log in]" : "[history]" }</p>
        </header>
    )
}