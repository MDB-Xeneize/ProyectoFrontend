import { render } from '@testing-library/react';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import moment from 'moment'
import { BrowserRouter as Router, Routes, Route, useParams, useNavigate } from 'react-router-dom';



export class AgregarChoferClass extends Component {
    constructor(props) {
        super(props)
        this.state = {
            nombre: '',          /*nombre es en la tabla tipo_viaje como se llama a entrada o salida*/
            apellido: '',
            dni: '',
            fecha_nacimiento: '',
            id_chofer: '',
            Chofer: [],
            registropas: ''
        }
    }

    componentDidMount() {

        if (this.props.registro.registro !== undefined) {

            this.setState({
                nombre: this.props.registro.registro.nombre,
                apellido: this.props.registro.registro.apellido,
                dni: this.props.registro.registro.dni,
                //moment.utc(registro.fecha).format('MM/DD/YYYY')
                fecha_nacimiento: moment.utc(this.props.registro.registro.fecha).format('YYYY-MM-DD'),
                id_chofer: this.props.registro.registro.id_chofer
            });
        }
        let parametros = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'authorization': sessionStorage.getItem('token')
            }
        }

        const url = "http://localhost:8080/api/chofer";
        fetch(url, parametros)
            .then(res => {
                return res.json()
                    .then(body => {

                        return {
                            status: res.status,
                            ok: res.ok,
                            headers: res.headers,
                            body: body
                        };
                    })
            }).then(

                result => {
                    if (result.ok) {
                        this.setState({
                            Chofer: result.body
                        });
                    } else {

                        toast.error(result.body.message, {
                            position: "bottom-center",
                            autoClose: 5000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                            theme: "light",
                        });
                    }
                }
            ).catch(
                (error) => { console.log(error) }
            );




    }

    handleChange = (event) => {
        const { name, value } = event.target;
        if (name === 'fecha_nacimiento') {
            const formattedDate = moment(value).format('YYYY-MM-DD');
            const today = moment(); // fecha actual
            const ageDifference = today.diff(moment(value), 'years');
          
            if (ageDifference >= 18) {
              this.setState({ [name]: formattedDate });
            }else{
                this.setState({ [name]: '' });
                this.MensajeError("Agregue la Fecha de Nacimiento, la persona debe ser mayor de 18 años");
            }
        } else {
            if (name === 'nombre' && value.length <= 30) {
                this.setState({ [name]: value });
            }
            if (name === 'apellido' && value.length <= 20) {
                this.setState({ [name]: value });
            }
            if (name === 'dni' && value.length <= 8 && !isNaN(value)) {
                this.setState({ [name]: value });
            }
        }
    
    }

    verificarCampos = () => {
        let enviar = true;
        if (this.state.nombre === '') {
            enviar = false;
            this.MensajeError("Agregue el Nombre");
        }
        if (this.state.apellido === '') {
            enviar = false;
            this.MensajeError("Agregue el Apellido");

        }
        if (this.state.dni.length <6) {
            enviar = false;
            this.MensajeError("Agregue el DNI, debe poseer al menos 6 digitos");
        }
        if (this.state.fecha_nacimiento ==='') {
            enviar = false;
            this.MensajeError("Agregue la Fecha de Nacimiento");
        }
        return enviar
    }

    MensajeError(mensaje) {
        toast.error(mensaje, {
            position: "bottom-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
        });
    }

    handleSubmit = (event) => {
        event.preventDefault()
        const enviar = this.verificarCampos();
        if (enviar === true) {
            let registro = {
                nombre: this.state.nombre,
                apellido: this.state.apellido,
                dni: this.state.dni,
                fecha_nacimiento: this.state.fecha_nacimiento,
                id_chofer: this.state.id_chofer
            }
            //Es Modificar o Agregar?
            let parametros = null;
            if (this.props.registro.extra !== undefined) {
                parametros = {
                    method: 'PUT',
                    body: JSON.stringify(registro),
                    headers: {
                        'Content-Type': 'application/json',
                        'authorization': sessionStorage.getItem('token')
                    }
                }

            }
            else {
                parametros = {
                    method: 'POST',
                    body: JSON.stringify(registro),
                    headers: {
                        'Content-Type': 'application/json',
                        'authorization': sessionStorage.getItem('token')
                    }
                }
            }

            const url = this.props.registro.extra !== undefined ? `http://localhost:8080/api/chofer/${this.props.registro.registro.id_chofer}` : "http://localhost:8080/api/chofer"
            fetch(url, parametros)
                .then(res => {
                    return res.json()
                        .then(body => {
                            return {
                                status: res.status,
                                ok: res.ok,
                                headers: res.headers,
                                body: body
                            };
                        })
                }).then(
                    result => {
                        if (result.ok) {

                            toast.success(result.body.message, {
                                position: "bottom-center",
                                autoClose: 5000,
                                hideProgressBar: false,
                                closeOnClick: true,
                                pauseOnHover: true,
                                draggable: true,
                                progress: undefined,
                                theme: "light",
                            });


                            this.props.useNavigateEnvuelta('/Chofer')

                        } else {
                            toast.error(result.body.message, {
                                position: "bottom-center",
                                autoClose: 5000,
                                hideProgressBar: false,
                                closeOnClick: true,
                                pauseOnHover: true,
                                draggable: true,
                                progress: undefined,
                                theme: "light",
                            });
                        }
                    }


                ).catch(
                    (error) => { console.log(error) }
                );
        }

    }


    render() {


        return (
            <>
                <div className='container bottom bottom2'>
                    <div className='row'>
                        <div className='col'>
                            {this.props.registro.extra === true ? <h3>Modificar Registro de Chofer</h3> : <h3>Registrar Chofer</h3>};
                        </div>
                    </div>

                    <div className='row'>
                        <div className='col-2'>

                        </div>
                        <div className='col'>

                            <form onSubmit={this.handleSubmit}>
                                <br />
                                <div className="form-floating">
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="nombre"
                                        placeholder="Nombre"
                                        onChange={this.handleChange}
                                        value={this.state.nombre}
                                        name='nombre'
                                    />
                                    <label htmlFor="nombre">Nombre</label>
                                </div>

                                <br />

                                <div className="form-floating">
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="apellido"
                                        placeholder="Apellido"
                                        onChange={this.handleChange}
                                        value={this.state.apellido}
                                        name='apellido'
                                    />
                                    <label htmlFor="apellido">Apellido</label>
                                </div>

                                <br />

                                <div className="form-floating">
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="dni"
                                        placeholder="12:00:00"
                                        onChange={this.handleChange}
                                        value={this.state.dni}
                                        name='dni'
                                    />
                                    <label htmlFor="hora">DNI</label>
                                </div>

                                <br />

                                <div className="form-floating">
                                    <input
                                        type="date"
                                        className="form-control"
                                        id="fecha_nacimiento"
                                        placeholder="DD-MM-AAAA"
                                        onChange={this.handleChange}
                                        value={this.state.fecha_nacimiento}
                                        name='fecha_nacimiento'
                                    />
                                    <label htmlFor="fecha_nacimiento">Fecha de Nacimiento</label>
                                </div>

                                <br />

                                <input className='btn btn-primary'
                                    type="submit"
                                    value="Guardar"
                                />
                            </form>
                        </div>
                        <div className='col-2'>

                        </div>
                    </div>
                </div>

            </>
        )
    }
}

export default AgregarChofer;



export function AgregarChofer(registro, extra) {

    const parametros = useParams();

    const useNavigateP = useNavigate();

    return (
        <>
            <AgregarChoferClass registro={registro} useNavigateEnvuelta={useNavigateP} params={parametros} />
        </>
    );
}