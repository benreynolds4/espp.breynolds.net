import React, { Component } from 'react'
import { degrees, PDFDocument, rgb, StandardFonts } from 'pdf-lib';

import {Row, Col} from 'react-bootstrap'

export class InputForm extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
            date: '',
            acquired_price_euro: '',
            fair_market_value: '',
            number_shares: 0,
            name: '',
            address_line_1: '',
            address_line_2: '',
            address_line_3: '',
            ppsn: '',
            pdf: ''
        }

        this.handleDateChange = this.handleDateChange.bind(this);
        this.handleNameChange = this.handleNameChange.bind(this);
        this.handleAddressChange1 = this.handleAddressChange1.bind(this);
        this.handleAddressChange2 = this.handleAddressChange2.bind(this);
        this.handleAddressChange3 = this.handleAddressChange3.bind(this);
        this.handlePPSNChange = this.handlePPSNChange.bind(this);
        this.handleAcquiredPriceChange = this.handleAcquiredPriceChange.bind(this);
        this.handleFairMarketValueChange = this.handleFairMarketValueChange.bind(this);
        this.handleNumberSharesChange = this.handleNumberSharesChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleNameChange(event) {
        this.setState({
            name: event.target.value
        })
    }

    handleAddressChange1(event) {
        this.setState({
            address_line_1: event.target.value
        })
    }
    handleAddressChange2(event) {
        this.setState({
            address_line_2: event.target.value
        })
    }
    handleAddressChange3(event) {
        this.setState({
            address_line_3: event.target.value
        })
    }

    handlePPSNChange(event) {
        this.setState({
            ppsn: event.target.value
        })
    }

    handleDateChange(event) {
        this.setState({
            date: event.target.value
        });
    }

    handleAcquiredPriceChange(event) {
        this.setState({
            acquired_price_euro: event.target.value
        });
    }

    handleFairMarketValueChange(event) {
        this.setState({
            fair_market_value: event.target.value
        });
    }

    handleNumberSharesChange(event) {
        this.setState({
            number_shares: event.target.value
        });
    }

    handlePdfUpdate(pdfBytes) {
        this.setState({
            pdf: pdfBytes
        })
    }
    
     async handleSubmit(event) {
        event.preventDefault();

        let totalAmountOfGainMadeOnShareOption = (parseFloat(this.state.fair_market_value) - parseFloat(this.state.acquired_price_euro)) * this.state.number_shares;
        let totalLiability = ((parseFloat(this.state.fair_market_value) - parseFloat(this.state.acquired_price_euro)) * 0.52 ) * this.state.number_shares
        const existingPdfBytes = await fetch('form-rtso1.pdf').then(res => res.arrayBuffer())
        const pdfDoc = await PDFDocument.load(existingPdfBytes)
        const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica)
        const boldItalic = await pdfDoc.embedFont(StandardFonts.TimesRomanBoldItalic)
        const pages = pdfDoc.getPages()
        const rtso1 = pages[0]

        rtso1.drawText(this.state.name, {
            x: 30 ,
            y: 725,
            size: 25,
            font: helveticaFont,
            color: rgb(0,0,0)
        })

        rtso1.drawText(this.state.address_line_1, {
            x: 300 ,
            y: 740,
            size: 10,
            font: helveticaFont,
            color: rgb(0,0,0)
        })

        rtso1.drawText(this.state.address_line_2, {
            x: 300 ,
            y: 730,
            size: 10,
            font: helveticaFont,
            color: rgb(0,0,0)
        })

        rtso1.drawText(this.state.address_line_3, {
            x: 300 ,
            y: 720,
            size: 10,
            font: helveticaFont,
            color: rgb(0,0,0)
        })

        rtso1.drawText(this.state.ppsn, {
            x: 145 ,
            y: 146,
            size: 25,
            font: helveticaFont,
            color: rgb(0,0,0)
        })

        let date = new Date(this.state.date)
        console.log(date)
        rtso1.drawText(`${date.getDate() < 10 ? '0'+date.getDate() : date.getDate()} ${(date.getMonth() + 1) < 10 ? '0'+(date.getMonth()+1) : (date.getMonth() +1)} ${date.getFullYear()} `, {
            x: 145 ,
            y: 106,
            size: 25,
            font: helveticaFont,
            color: rgb(0,0,0)
        })

        /* rtso1.drawText(this.state.name, {
            x: 408 ,
            y: 106,
            size: 25,
            font: boldItalic,
            color: rgb(0,0,0)
        }) */

        rtso1.drawText(`${Math.floor(totalAmountOfGainMadeOnShareOption)}`, {
            x: 145 ,
            y: 38,
            size: 25,
            font: helveticaFont,
            color: rgb(0,0,0)
        })

        rtso1.drawText(`${Math.floor(totalLiability)}`, {
            x: 417 ,
            y: 38,
            size: 25,
            font: helveticaFont,
            color: rgb(0,0,0)
        })
        // Serialize the PDFDocument to bytes (a Uint8Array)
        const pdfBytes = await pdfDoc.saveAsBase64()
        console.log(pdfBytes)
        this.handlePdfUpdate(pdfBytes)
    }
    
    render() {
        let href = `data:application/pdf;base64,${this.state.pdf}`
        return (
            <React.Fragment>
                <div class="container">
                    <form onSubmit={this.handleSubmit}>
                        <Row className=" justify-content-md-center">
                            <Col xl={6} lg={6} md={6} sm={12} className="col-12">
                                <div className="login-screen">
                                    <div className="login-box">
                                        <div className="login-logo">
                                            <h2>Generate RTSO1</h2>
                                            <p>
                                                From Morgan Stanley, Go to overview> espp click on ~79U see list of espp deposits , quantity, acquired price available to sell etc
                                            </p>
                                        </div>
                                        <Row className="gutters">
                                            <Col xl={6} md={6} sm={6}>
                                                <div className="form-group">
                                                <input type="text" className="form-control" value={this.state.name} placeholder="Name" onChange={this.handleNameChange} />
                                                </div>
                                            </Col>
                                            <Col xl={6} md={6} sm={6}>
                                                <div className="form-group">
                                                    <input type="text" value={this.state.address_line_1} className="form-control" placeholder="Address Line 1" onChange={this.handleAddressChange1} />
                                                </div>
                                            </Col>
                                            <Col xl={6} md={6} sm={6}>
                                                <div className="form-group">
                                                    <input type="text" value={this.state.ppsn} className="form-control" placeholder="PPSN" onChange={this.handlePPSNChange} />
                                                </div>
                                            </Col>
                                            <Col xl={6} md={6} sm={6}>
                                                <div className="form-group">
                                                    <input type="text" value={this.state.address_line_2} className="form-control" placeholder="Address Line 2" onChange={this.handleAddressChange2} />
                                                </div>
                                            </Col>
                                            <Col xl={6} md={6} sm={6}>
                                                <div className="form-group">
                                                    <input type="date" value={this.state.date} className="form-control"  onChange={this.handleDateChange} />  
                                                </div>
                                            </Col>
                                            <Col xl={6} md={6} sm={6}>
                                                <div className="form-group">
                                                    <input type="text" value={this.state.address_line_3}  className="form-control" placeholder="Address Line 3" onChange={this.handleAddressChange3} />
                                                </div>
                                            </Col>
                                            <Col xl={6} md={6} sm={6}>
                                                <div className="form-group">
                                                    <input type="text" value={this.state.acquired_price_euro} className="form-control" placeholder="Acquired Price (Euro)" onChange={this.handleAcquiredPriceChange} />
                                                </div>
                                            </Col>
                                            <Col xl={6} md={6} sm={6}>
                                                <div className="form-group">
                                                    <input type="text" value={this.state.fair_market_value} className="form-control" placeholder="Fair Market Value (Euro)" onChange={this.handleFairMarketValueChange} />
                                                </div>
                                            </Col>
                                            <Col xl={6} md={6} sm={6}>
                                                <div className="form-group">
                                                    <label className="">
                                                        Number of Shares
                                                    </label>
                                                    <input type="number" value={this.state.number_shares} className="form-control" onChange={this.handleNumberSharesChange} />
                                                </div>
                                            </Col>
                                        </Row>
                                        <div className="actions clearfix">
                                            <button type="submit" className="btn btn-primary btn-block">Generate</button>
                                        </div>
                                       
                                       {
                                           this.state.pdf != '' ?
                                            <React.Fragment>
                                                <div className="or">
                                                    <span>Download File</span>
                                                </div>
                                                <Row className=" gutters">
                                                    <Col xl={12} lg={12} md={12} sm={12} className="col-12">
                                                        <a href={href} className="btn btn-tw btn-block" download="PopulatedRTSO1.pdf">Download</a>
                                                    </Col>
                                                    <Col xl={12} lg={12} md={12} sm={12} className="col-12">
                                                        You must pay and file by 30 Days after you're Share Deposit Dates
                                                    </Col>
                                                </Row>
                                            </React.Fragment>
                                           :
                                           ''
                                       }
                                       
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </form>
                </div>
            </React.Fragment>
            

        )
    }
}

export default InputForm
