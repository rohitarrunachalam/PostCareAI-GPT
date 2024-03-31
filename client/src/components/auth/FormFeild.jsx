import React, { Fragment, useCallback, useRef, useState } from 'react'
import { Eye, EyeHide } from '../../assets'

const FormFeild = ({ label,
    value, name, type, handleInput,
    passwordClass, isDisabled, error }) => {

    const [showPass, setShowPass] = useState(false)

    let inputRef = useRef()
    let labelRef = useRef()

    const inputClass = useCallback((add, label, input) => {
        if (add) {
            labelRef.current?.classList.add(...label)
            inputRef.current?.classList.add(...input)
        } else {
            labelRef.current?.classList.remove(...label)
            inputRef.current?.classList.remove(...input)
        }
    }, [])

    return (
        <Fragment>
            {label && <label
                className={`inter-500 labelEffect ${value && 'active-label'} ${error && 'warning-label'}`}
                ref={labelRef}>{label}</label>}

            <input
                // className={`${error && 'warning-input'} ${inputRef ? value ? 'inputEffect active-input' : 'inputEffect' : ''}`}
                className='shadow inter-400 mt-2 appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                value={value} name={name}

                ref={inputRef} type={type} onFocus={() => {
                    inputClass(true, ["active-label", "active-label-green"], ["active-input", "active-input-green"])
                }}

                onBlur={() => {
                    if (inputRef.current?.value.length <= 0) {
                        inputClass(false, ["active-label", "active-label-green"], ["active-input", "active-input-green"])
                    } else {
                        inputClass(false, ["active-label-green"], ["active-input-green"])
                    }
                }}

                onInput={(e) => {
                    handleInput(e)
                    if (passwordClass) {
                        document.querySelector('#alertBox').style.display = "block"

                        if (e.target.value.length >= 8) {
                            passwordClass('text-red-500', "text-green-500")
                        } else {
                            passwordClass("text-green-500", "text-red-500")
                        }
                    }
                }}

                disabled={isDisabled} readOnly={isDisabled} required
            />

            {
                type === 'password' && <>
                    {showPass ? <button  className="absolute bottom-[40%] ml-2" type='button' onClick={() => {
                        inputRef.current.type = "password"
                        setShowPass(false)
                    }}>{<EyeHide />}</button>
                        : <button type='' className='absolute bottom-[40%] ml-2' onClick={() => {
                            inputRef.current.type = "text"
                            setShowPass(true)
                        }}><Eye /></button>}
                </>
            }
        </Fragment>
    )
}

export default FormFeild
