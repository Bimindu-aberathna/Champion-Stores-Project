import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import React from 'react';
import { MDBFooter, MDBContainer, MDBRow, MDBCol, MDBIcon } from 'mdb-react-ui-kit';
import Logo from '../Assets/logo.png';
import { FaFacebookSquare,FaTiktok,FaInstagram,FaWhatsapp,FaPhone } from "react-icons/fa";
import { FaSquareXTwitter,FaMapLocationDot } from "react-icons/fa6";
import { MdMail } from "react-icons/md";
import './Footer.css';


export default function Footer() {
  return (
    <MDBFooter bgColor='light' className='text-center text-lg-start text-muted'>
      <section className='d-flex justify-content-center justify-content-lg-between p-4 border-bottom'id='footerHead'>
        <div className='me-5 d-none d-lg-block'>
          <span>Get connected with us on social networks:</span>
        </div>

        <div>
          <a href='' className='me-4 text-reset'>
            <FaFacebookSquare/>
            
          </a>
          <a href='' className='me-4 text-reset'>
            <FaSquareXTwitter />
          </a>
          <a href='' className='me-4 text-reset'>
            <FaTiktok />
          </a>
          <a href='' className='me-4 text-reset'>
            <FaInstagram />
          </a>
          <a href='' className='me-4 text-reset'>
            <MdMail />
          </a>
        </div>
      </section>

      <section className=''>
        <MDBContainer className='text-center text-md-start mt-5'>
          <MDBRow className='mt-3'>
            <MDBCol md="3" lg="4" xl="3" className='mx-auto mb-4'>
              <img src={Logo} alt='Logo' style={{ width: '100px' }} />
              <p className='footerDescription'>
              "Elevate your beauty and playtime with our range of cosmetic products and toys for all ages!"
              </p>
            </MDBCol>

            <MDBCol md="2" lg="2" xl="2" className='mx-auto mb-4'>
              <h6 className='text-uppercase fw-bold mb-4'>Products</h6>
              <p>
                <a href='#!' className='text-reset'>
                  Toys
                </a>
              </p>
              <p>
                <a href='#!' className='text-reset'>
                  Cosmetic products
                </a>
              </p>
              <p>
                <a href='#!' className='text-reset'>
                  Perfumes
                </a>
              </p>
              <p>
                <a href='#!' className='text-reset'>
                  Personal care products
                </a>
              </p>
            </MDBCol>

            <MDBCol md="3" lg="2" xl="2" className='mx-auto mb-4'>
              <h6 className='text-uppercase fw-bold mb-4'>Useful links</h6>
              <p>
                <a href='#!' className='text-reset'>
                  About us
                </a>
              </p>
              <p>
                <a href='#!' className='text-reset'>
                  Our policies
                </a>
              </p>
              
              <p>
                <a href='#!' className='text-reset'>
                  Help
                </a>
              </p>
            </MDBCol>

            <MDBCol md="4" lg="3" xl="3" className='mx-auto mb-md-0 mb-4'>
                <div className='contact'>
              <h6 className='text-uppercase fw-bold mb-4'>Contact</h6>
              <p>
                <FaMapLocationDot className='contactIcon'/>
                391, Mathugama Road, Dharga Town.
              </p>
              <p>
                <MdMail className='contactIcon'/>
                champion.stores@gmail.com
              </p>
              <p>
              <FaWhatsapp className='contactIcon'/>077 778 2487
              </p>
              <p>
                <FaPhone className='contactIcon'/>034 225 4879
              </p>
              </div>
            </MDBCol>
          </MDBRow>
        </MDBContainer>
      </section>

      <div className='text-center p-4' id='footerBottom'>
        © 2024 Copyright:
        <a className='text-reset fw-bold' href='https://mdbootstrap.com/'>
          ChampionStores SriLanka.com
        </a>
      </div>
    </MDBFooter>
  );
}