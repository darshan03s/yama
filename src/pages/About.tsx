import React from 'react'
import { Wrapper } from '../components'

const About: React.FC = () => {
    return (
        <Wrapper className='space-y-4 p-4'>
            <h1 className='text-3xl py-2'>About</h1>
            <p>YAMA(Yet another movie app) is a movie and TV show website that provides information about movies and TV shows using the TMDB api. It is a user-friendly and easy-to-use website that allows users to search for movies and TV shows, view their details</p>
        </Wrapper>
    )
}

export default About
