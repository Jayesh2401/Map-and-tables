import Carousel from "react-bootstrap/Carousel";

function SimpleCarousel() {
  const caroselData = [
    {
      imgSrc: "https://picsum.photos/900/400",
      title: "title 1",
      description: "description 1",
    },
    {
      imgSrc: "https://picsum.photos/900/400",
      title: "title 2",
      description: "description 2",
    },
  ];

  return (
    <Carousel variant="dark">
      {caroselData.map((item) => {
        return (
          <Carousel.Item key={item.title}>
            <img className="d-block w-100" src={item.imgSrc} alt={item.title} />
            <Carousel.Caption>
              <h5>{item.title}</h5>
              <p>{item.description}</p>
            </Carousel.Caption>
          </Carousel.Item>
        );
      })}
    </Carousel>
  );
}

export default SimpleCarousel;
