import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import '../styles/NotFound.css';

const NotFound = () => {
  return (
    <Container>
      <Row className="justify-content-center mt-5">
        <Col xs={12} sm={8} md={6} lg={4}>
          <div className="text-center">
            <h2>404 - Not Found</h2>
            <p>Страница не найдена</p>
            <img src="https://i.pinimg.com/564x/9c/2e/b1/9c2eb1fa57818fd015bf1623e3de6092.jpg" alt="404" />
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default NotFound;