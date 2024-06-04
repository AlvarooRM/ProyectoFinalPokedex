import { useEffect, useState } from 'react';
import { useForm } from '../hook/useForm';
import { PokemonContext } from './PokemonContext';
import axios from 'axios';

export const PokemonProvider = ({ children }) => {
    const [allPokemons, setAllPokemons] = useState([]);
    const [globalPokemons, setGlobalPokemons] = useState([]);
    const [team, setTeam] = useState([]);
    const [offset, setOffset] = useState(0);

    const { valueSearch, onInputChange, onResetForm } = useForm({
        valueSearch: '',
    });

    const [loading, setLoading] = useState(true);
    const [active, setActive] = useState(false);

    const getAllPokemons = async (limit = 25) => {
        const baseURL = 'https://pokeapi.co/api/v2/';

        const res = await fetch(
            `${baseURL}pokemon?limit=${limit}&offset=${offset}`
        );
        const data = await res.json();

        const promises = data.results.map(async pokemon => {
            const res = await fetch(pokemon.url);
            const data = await res.json();
            if (data.id <= 386) {
                return data;
            }
        });
        const results = (await Promise.all(promises)).filter(Boolean);

        setAllPokemons([...allPokemons, ...results]);
        setLoading(false);
    };

    const getGlobalPokemons = async () => {
        const baseURL = 'https://pokeapi.co/api/v2/';

        const res = await fetch(
            `${baseURL}pokemon?limit=386&offset=0`
        );
        const data = await res.json();

        const promises = data.results.map(async pokemon => {
            const res = await fetch(pokemon.url);
            const data = await res.json();
            if (data.id <= 386) {
                return data;
            }
        });
        const results = (await Promise.all(promises)).filter(Boolean);

        setGlobalPokemons(results);
        setLoading(false);
    };

    const getPokemonByID = async id => {
        const baseURL = 'https://pokeapi.co/api/v2/';

        const res = await fetch(`${baseURL}pokemon/${id}`);
        const data = await res.json();
        return data;
    };

    const addPokemonToTeam = (pokemon) => {
        if (!team.find(p => p.id === pokemon.id)) {
            setTeam([...team, pokemon]);
        }
    };

    const saveTeam = async () => {
        try {
            const response = await axios.post('/pokedex/save-team.php', { team });
            if (response.data.success) {
                alert('Equipo guardado con éxito!');
            } else {
                alert('Error al guardar el equipo');
            }
        } catch (error) {
            console.error('Error al guardar el equipo', error);
        }
    };

    const loadTeam = async () => {
        try {
            const response = await axios.get('/pokedex/load-team.php');
            if (response.data.success) {
                setTeam(response.data.team);
            } else {
                console.error('Error al cargar el equipo');
            }
        } catch (error) {
            console.error('Error al cargar el equipo', error);
        }
    };

    useEffect(() => {
        getAllPokemons();
    }, [offset]);

    useEffect(() => {
        getGlobalPokemons();
        loadTeam(); 
    }, []);

    const onClickLoadMore = () => {
        setOffset(offset + 25);
    };

    const getSpeciesData = async (id) => {
        const baseURL = 'https://pokeapi.co/api/v2/';
        const res = await fetch(`${baseURL}pokemon-species/${id}`);
        const data = await res.json();
        return data;
    };

    const getEvolutionChain = async (url) => {
        const res = await fetch(url);
        const data = await res.json();
        return data;
    };

    const [typeSelected, setTypeSelected] = useState({
        grass: false,
        normal: false,
        fighting: false,
        flying: false,
        poison: false,
        ground: false,
        rock: false,
        bug: false,
        ghost: false,
        steel: false,
        fire: false,
        water: false,
        electric: false,
        psychic: false,
        ice: false,
        dragon: false,
        dark: false,
        fairy: false,
        unknow: false,
        shadow: false,
    });

    const [filteredPokemons, setfilteredPokemons] = useState([]);

    const handleCheckbox = e => {
        setTypeSelected({
            ...typeSelected,
            [e.target.name]: e.target.checked,
        });

        if (e.target.checked) {
            const filteredResults = globalPokemons.filter(pokemon =>
                pokemon.types
                    .map(type => type.type.name)
                    .includes(e.target.name)
            );
            setfilteredPokemons([...filteredPokemons, ...filteredResults]);
        } else {
            const filteredResults = filteredPokemons.filter(
                pokemon =>
                    !pokemon.types
                        .map(type => type.type.name)
                        .includes(e.target.name)
            );
            setfilteredPokemons([...filteredResults]);
        }
    };

    return (
        <PokemonContext.Provider
            value={{
                valueSearch,
                onInputChange,
                onResetForm,
                allPokemons,
                globalPokemons,
                getPokemonByID,
                addPokemonToTeam,
                team,
                setTeam, 
                saveTeam,
                onClickLoadMore,
                loading,
                setLoading,
                active,
                setActive,
                handleCheckbox,
                filteredPokemons,
                getSpeciesData,
                getEvolutionChain,
            }}
        >
            {children}
        </PokemonContext.Provider>
    );
};
