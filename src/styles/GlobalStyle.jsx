import styled, { createGlobalStyle } from "styled-components";
import 'react-toastify/dist/ReactToastify.css'

export default createGlobalStyle`
    * {
        margin: 0;
        padding: 0;
        outline: none;
        box-sizing: border-box;
        
        &::-webkit-scrollbar {
            width: 5px; /* Largura da barra de rolagem */
            margin-right: 5px; /* Margem à direita da barra de rolagem */
        }

        /* Estilizando o track da barra de rolagem */
        &::-webkit-scrollbar-track {
            background-color: #f1f1f1; /* Cor de fundo do track */
        }

        /* Estilizando o thumb (alça) da barra de rolagem */
        &::-webkit-scrollbar-thumb {
            background-color: #888; /* Cor do thumb */
        }

        /* Estilizando o thumb ao passar o mouse */
        &::-webkit-scrollbar-thumb:hover {
            background-color: #555; /* Cor do thumb ao passar o mouse */
        }
    }

    body{
        font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;
        color: black;
    }

    #root{
        display: flex;
        align-items: start;
        flex-direction: column;
        justify-content: start;
        flex-grow: 1;
        position: relative;
        height: 100%;
        width: 100%;
        overflow: scroll;
        overflow-x: hidden;
    }

    a {
        text-decoration: none;
    }

`;
