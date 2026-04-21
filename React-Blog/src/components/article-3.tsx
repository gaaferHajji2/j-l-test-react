import { faArrowRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'

export default function Article03() {
  return (
    <article className="my-4 shadow">
            <a href="#">
                <img className="hover:opacity-75 w-full object-cover max-h-120" src="https://images.unsplash.com/photo-1507120366498-4656eaece7fa?q=80&w=871&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" />
            </a>

            <div className="flex flex-col p-6 pt-2 bg-white">
                <a href="#" className="my-2 text-sm font-bold uppercase border-b-2
                 border-yellow-500 text-blue-600">Typography</a>
                <a href="#" className="pb-4 text-3xl font-serif font-bold hover:text-gray-700">Lorem ipsum dolor sit amet consectetur adipisicing elit. Facilis quisquam illo eveniet nulla ratione, eius voluptas placeat quasi, enim deserunt suscipit iusto. Vitae rem in perspiciatis recusandae voluptates facere? Commodi.</a>
                <p className="pb-3 text-sm">By <a href="#" className="font-semibold hover:text-gray-800">Jafar Loka</a> 04/19/2026</p>
                <p className="pb-6">Lorem ipsum dolor sit amet consectetur adipisicing elit. Nostrum quaerat ea, iste inventore quasi minus incidunt maxime sequi voluptatibus. Facere architecto ullam optio dolor? Nesciunt impedit, ea quisquam cumque maiores cupiditate sit rem, minima quo eos repellendus reiciendis sint? Necessitatibus incidunt voluptas corrupti! Distinctio ducimus sapiente voluptatum cumque, neque nam?</p>
                <a href="#" className="uppercase text-xs text-blue-600 hover:text-yellow-500 w-32">
                    Continue Reading
                    <FontAwesomeIcon icon={faArrowRight} />
                </a>
            </div>
        </article>
  )
}
