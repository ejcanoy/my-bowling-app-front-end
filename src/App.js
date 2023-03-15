import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import Home from './pages/Home.js';
import Leagues from './pages/League.js';
import Games from './pages/Games';
import Frames from './pages/Frames';
import Sets, { setsLoader } from './pages/Sets';
import RootLayout from './layouts/RootLayout';
import { createBrowserRouter, createRoutesFromElements, RouterProvider, Route, NavLink, Link } from 'react-router-dom';
import { useState, useEffect } from 'react'

const blank_frame = {
  game_id: 0,
  frame_number: 1,
  bonus: 0,
  throw_one: -1,
  throw_two: -1,
}


const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<RootLayout />}>
      <Route index element={<Home />} />
      <Route path="leagues" >
        <Route index element={<Leagues />} />
        <Route path="sets">
          <Route index element={<Sets />}/>
          <Route path=":setId" >
            <Route index element={<Games />}/>
            <Route path="games">
            <Route index element={<Games />}/>
            <Route path=":id" element={<Frames />}/>
          </Route>
          </Route>
        </Route>
      </Route>
      <Route path="*" element={<h1>NOT FOUND</h1>} />
    </Route>
  )
)

function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

// function App() {
//   return (
//     <>
//       <div>
//         <Game />
//       </div>
//     </>
//   );
// }

export default App;
