
return{

    const PixelButton = styled.button`
    background-color: ${({ color }) => color || '#fff'};
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    font-size: 1rem;
    cursor: pointer;
    border: 4px solid #2f2f2f;
    box-shadow: inset -4px -4px 0px rgba(0,0,0,0.3);
    font-family: 'Press Start 2P', cursive;

    &:hover {
        filter: brightness(1.1);
    }
    `;

}