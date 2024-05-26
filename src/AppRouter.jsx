import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { Navigation } from './components/Navigation';
import { MyTeam } from './components/MyTeam';
import { Comparator } from './components/Comparator';
import { HomePage, PokemonPage, SearchPage } from './pages';

export const AppRouter = () => {
	return (
		<Routes>
			<Route path='/' element={<Navigation />}>
				<Route index element={<HomePage />} />
				<Route path='pokemon/:id' element={<PokemonPage />} />
				<Route path='search' element={<SearchPage />} />
				<Route path="my-team" element={<MyTeam />} />
				<Route path='/comparator' element={<Comparator />} />

				
			</Route>

            <Route path='*' element={<Navigate to='/' />} />
		</Routes>
	);
};
