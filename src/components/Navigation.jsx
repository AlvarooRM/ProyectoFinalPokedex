import { useContext, useEffect, useState } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { PokemonContext } from '../context/PokemonContext';
import axios from 'axios';
import logo from '../assets/Pokédex_logo.png';
import pikachu from '../assets/pikachu.png';

export const Navigation = () => {
    const { globalPokemons, onInputChange, valueSearch, onResetForm } = useContext(PokemonContext);
    const navigate = useNavigate();
    const [userInfo, setUserInfo] = useState(null);
    const [suggestions, setSuggestions] = useState([]);
    const [activeSuggestion, setActiveSuggestion] = useState(-1);
    const [showSuggestions, setShowSuggestions] = useState(false);

    useEffect(() => {
        axios.get('/config.php?action=user_info')
            .then(response => {
                setUserInfo(response.data);
            })
            .catch(error => {
                console.error('Error fetching user info:', error);
            });
    }, []);

    const onSearchSubmit = e => {
        e.preventDefault();
        if (activeSuggestion >= 0 && activeSuggestion < suggestions.length) {
            handleSuggestionClick(suggestions[activeSuggestion].name);
        } else {
            navigate('/search', {
                state: valueSearch,
            });
            onResetForm();
        }
    };

    const handleInputChange = e => {
        onInputChange(e);
        if (e.target.value.length > 1) {
            const filteredSuggestions = globalPokemons
                .filter(pokemon => pokemon.name.toLowerCase().includes(e.target.value.toLowerCase()))
                .slice(0, 10); 
            setSuggestions(filteredSuggestions);
            setActiveSuggestion(-1);
            setShowSuggestions(true);
        } else {
            setSuggestions([]);
            setShowSuggestions(false);
        }
    };

    const handleSuggestionClick = name => {
        onInputChange({ target: { name: 'valueSearch', value: name } });
        setSuggestions([]);
        setShowSuggestions(false);
        navigate(`/pokemon/${name.toLowerCase()}`);
        onResetForm();
    };

    const handleKeyDown = e => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (activeSuggestion >= 0 && activeSuggestion < suggestions.length) {
                handleSuggestionClick(suggestions[activeSuggestion].name);
            }
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (activeSuggestion > 0) {
                setActiveSuggestion(activeSuggestion - 1);
            }
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (activeSuggestion < suggestions.length - 1) {
                setActiveSuggestion(activeSuggestion + 1);
            }
        }
    };

    const userIcon = pikachu;

    return (
        <>
            <header className='container'>
                <Link to='/' className='logo'>
                    <img src={logo} alt='Logo Pokedex' />
                </Link>

                <form onSubmit={onSearchSubmit}>
                    <div className='form-group'>
                        <svg
                            xmlns='http://www.w3.org/2000/svg'
                            fill='none'
                            viewBox='0 0 24 24'
                            strokeWidth='1.5'
                            stroke='currentColor'
                            className='icon-search'
                        >
                            <path
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                d='M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z'
                            />
                        </svg>
                        <input
                            type='search'
                            name='valueSearch'
                            value={valueSearch}
                            onChange={handleInputChange}
                            onKeyDown={handleKeyDown}
                            placeholder='Buscar Pokemon'
                            autoComplete='off'
                        />
                        {showSuggestions && suggestions.length > 0 && (
                            <ul className="suggestions">
                                {suggestions.map((pokemon, index) => (
                                    <li
                                        key={pokemon.id}
                                        className={index === activeSuggestion ? 'active' : ''}
                                        onClick={() => handleSuggestionClick(pokemon.name)}
                                    >
                                        <img src={pokemon.sprites.front_default} alt={pokemon.name} className="suggestion-icon" />
                                        {pokemon.name}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                    <button className='btn-search'>Buscar</button>
                </form>

                {userInfo && (
                    <div className='dropdown'>
                        <img src={userIcon} alt='User Icon' className='user-icon dropbtn' />
                        <div className='dropdown-content'>
                            <Link to='/my-team'>Mi Equipo</Link>
                            <Link to='/comparator'>Comparador</Link>
                        </div>
                    </div>
                )}
            </header>
            <Outlet />
        </>
    );
};
