import axios from 'axios'

interface Pet {
	id: number
	name: string
	// другие поля, если необходимо
}

async function getPets() {
	try {
		const response = await axios.get<Pet[]>(
			'https://petstore3.swagger.io/api/v3/pet/findByStatus?status=available'
		)
		const data = response.data
		console.log(data)
	} catch (error) {
		console.error('Error fetching pets:', error)
	}
}

getPets()
