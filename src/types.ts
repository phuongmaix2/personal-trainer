export type ApiLink = {
  href: string
}

export type Customer = {
  firstname: string
  lastname: string
  streetaddress: string
  postcode: string
  city: string
  email: string
  phone: string
  _links: {
    self: ApiLink
    customer: ApiLink
    trainings: ApiLink
  }
}

export type CustomerResponse = {
  _embedded: {
    customers: Customer[]
  }
}

export type TrainingCustomer = {
  id: number
  firstname: string
  lastname: string
  streetaddress: string
  postcode: string
  city: string
  email: string
  phone: string
}

export type Training = {
  id: number
  date: string
  duration: number
  activity: string
  customer: TrainingCustomer
}

export type CustomerInput = Omit<Customer, '_links'>

export type TrainingInput = {
  date: string
  activity: string
  duration: number
  customer: string
}