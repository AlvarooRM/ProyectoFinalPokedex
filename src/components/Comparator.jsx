import React, { useContext, useState } from 'react';
import { PokemonContext } from '../context/PokemonContext';

const typeTranslations = {
    grass: 'planta',
    fire: 'fuego',
    water: 'agua',
    bug: 'bicho',
    normal: 'normal',
    poison: 'veneno',
    electric: 'eléctrico',
    ground: 'tierra',
    fairy: 'hada',
    fighting: 'lucha',
    psychic: 'psíquico',
    rock: 'roca',
    ghost: 'fantasma',
    ice: 'hielo',
    dragon: 'dragón',
    dark: 'siniestro',
    steel: 'acero',
    flying: 'volador'
};

const statTranslations = {
    hp: 'Puntos de Salud',
    attack: 'Ataque',
    defense: 'Defensa',
    'special-attack': 'Ataque Especial',
    'special-defense': 'Defensa Especial',
    speed: 'Velocidad'
};

export const Comparator = () => {
    const { globalPokemons, getPokemonByID } = useContext(PokemonContext);
    const [firstPokemon, setFirstPokemon] = useState(null);
    const [secondPokemon, setSecondPokemon] = useState(null);
    const [selectedFirstPokemon, setSelectedFirstPokemon] = useState('');
    const [selectedSecondPokemon, setSelectedSecondPokemon] = useState('');
    const [firstSuggestions, setFirstSuggestions] = useState([]);
    const [secondSuggestions, setSecondSuggestions] = useState([]);

    const handleFirstChange = async (event) => {
        const query = event.target.value;
        setSelectedFirstPokemon(query);
        const suggestions = globalPokemons.filter(pokemon => pokemon.name.toLowerCase().includes(query.toLowerCase()));
        setFirstSuggestions(suggestions);
        if (suggestions.length === 1) {
            const data = await getPokemonByID(suggestions[0].id);
            setFirstPokemon(data);
        }
    };

    const handleSecondChange = async (event) => {
        const query = event.target.value;
        setSelectedSecondPokemon(query);
        const suggestions = globalPokemons.filter(pokemon => pokemon.name.toLowerCase().includes(query.toLowerCase()));
        setSecondSuggestions(suggestions);
        if (suggestions.length === 1) {
            const data = await getPokemonByID(suggestions[0].id);
            setSecondPokemon(data);
        }
    };

    const selectFirstPokemon = async (pokemon) => {
        const data = await getPokemonByID(pokemon.id);
        setFirstPokemon(data);
        setSelectedFirstPokemon(pokemon.name);
        setFirstSuggestions([]);
    };

    const selectSecondPokemon = async (pokemon) => {
        const data = await getPokemonByID(pokemon.id);
        setSecondPokemon(data);
        setSelectedSecondPokemon(pokemon.name);
        setSecondSuggestions([]);
    };

    const getComparisonClass = (stat1, stat2) => {
        if (stat1 > stat2) return 'stat-winner';
        if (stat1 < stat2) return 'stat-loser';
        return '';
    };

    return (
        <div className="comparator-page container">
            <h1>Comparador de Pokémon</h1>
            <br />
            <div className="search-container">
                <div className="search-bar-container">
                    <input
                        type="text"
                        value={selectedFirstPokemon}
                        onChange={handleFirstChange}
                        placeholder="Buscar Pokémon 1"
                        className="search-bar"
                    />
                    {firstSuggestions.length > 0 && (
                        <div className="suggestions">
                            {firstSuggestions.map(pokemon => (
                                <div
                                    key={pokemon.id}
                                    onClick={() => selectFirstPokemon(pokemon)}
                                    className="suggestion-item"
                                >
                                    {pokemon.name}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                <div className="search-bar-container">
                    <input
                        type="text"
                        value={selectedSecondPokemon}
                        onChange={handleSecondChange}
                        placeholder="Buscar Pokémon 2"
                        className="search-bar"
                    />
                    {secondSuggestions.length > 0 && (
                        <div className="suggestions">
                            {secondSuggestions.map(pokemon => (
                                <div
                                    key={pokemon.id}
                                    onClick={() => selectSecondPokemon(pokemon)}
                                    className="suggestion-item"
                                >
                                    {pokemon.name}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            <div className="comparison-container">
                {firstPokemon && (
                    <div className="pokemon-info">
                        <h2>{firstPokemon.name}</h2>
                        <img src={firstPokemon.sprites.other.dream_world.front_default} alt={firstPokemon.name} />
                        <p>Altura: {firstPokemon.height * 10}cm</p>
                        <p>Peso: {firstPokemon.weight / 10}KG</p>
                        <p>Tipos: {firstPokemon.types.map(type => typeTranslations[type.type.name]).join(', ')}</p>
                    </div>
                )}
                {secondPokemon && (
                    <div className="pokemon-info">
                        <h2>{secondPokemon.name}</h2>
                        <img src={secondPokemon.sprites.other.dream_world.front_default} alt={secondPokemon.name} />
                        <p>Altura: {secondPokemon.height * 10}cm</p>
                        <p>Peso: {secondPokemon.weight / 10}KG</p>
                        <p>Tipos: {secondPokemon.types.map(type => typeTranslations[type.type.name]).join(', ')}</p>
                    </div>
                )}
            </div>
            {firstPokemon && secondPokemon && (
                <div className="stats-comparison">
                    <table className="stat-table">
                        <thead>
                            <tr>
                                <th>{firstPokemon.name}</th>
                                <th>Estadística</th>
                                <th>{secondPokemon.name}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {firstPokemon.stats.map((stat, index) => (
                                <tr key={index}>
                                    <td className={`stat-value ${getComparisonClass(stat.base_stat, secondPokemon.stats[index].base_stat)}`}>
                                        {stat.base_stat}
                                    </td>
                                    <td className="stat-name">
                                        {statTranslations[stat.stat.name]}
                                    </td>
                                    <td className={`stat-value ${getComparisonClass(secondPokemon.stats[index].base_stat, stat.base_stat)}`}>
                                        {secondPokemon.stats[index].base_stat}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            <div className="spacer"></div>
        </div>
    );
};
