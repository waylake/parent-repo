import Card from 'react-bootstrap/Card';


export function InterDetial(props) {
  return (
      <>
        {[
          'Light',
        ].map((variant) => (
          <Card
            bg={variant.toLowerCase()}
            key={variant}
            text={variant.toLowerCase() === 'light' ? 'dark' : 'white'}
            style={{ width: '18rem' }}
            className="mb-2"
          >
            <Card.Header>{props.header}</Card.Header>
            <Card.Body>
              <Card.Title>{variant} {props.title}</Card.Title>
              <Card.Text>
                {props.text}
              </Card.Text>
            </Card.Body>
          </Card>
        ))}
      </>
  );
}

export default InterDetial;