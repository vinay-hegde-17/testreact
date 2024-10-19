import { render,screen } from "@testing-library/react";
import Greet from "./Greet";

test('Greet renders correctly', () => { 
    render(<Greet/>) 
    const textVal=screen.getByText('Hello')
    expect(textVal).toBeInTheDocument()
})

test('Greet renders correctly', () => { 
    render(<Greet name='Vinay'/>) 
    const textVal=screen.getByText('Hello Vinay')
    expect(textVal).toBeInTheDocument()
})
