interface ClassElementDescriptor {
    kind: 'field' | 'method'
    key: string
    placement: 'static' | 'prototype' | 'own'
    descriptor: PropertyDescriptor
    extras?: ClassElementDescriptor[]
}

interface ClassMethodDescriptor extends ClassElementDescriptor {
    kind: 'method'
}

declare function bound(): ClassMethodDescriptor

export default ClassElementDescriptor
