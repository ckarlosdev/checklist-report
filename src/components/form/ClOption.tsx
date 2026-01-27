import { ButtonGroup, Card, Col, Row, ToggleButton } from "react-bootstrap";
import type { Item } from "../../types";
import useEquipmentClStore from "../../stores/useEquipmentClStore";

type Props = {
  item: Item;
};

function ClOption({ item }: Props) {
  const setSelectedOption = useEquipmentClStore(
    (state) => state.setSelectedOption,
  );

  const currentValue = useEquipmentClStore(
    (state) =>
      state.checklist.selectedOptions.find((opt) => opt.name === item.name)
        ?.selectedValue,
  );

  const handleChange = (val: string) => {
    setSelectedOption(item.name, val);
  };

  return (
    <>
      <Card
        style={{ width: "350px" }}
        className="text-center shadow-sm mt-2 mb-2"
      >
        <Card.Header style={{ fontWeight: "bold", fontSize: "1.25rem" }}>
          {item.name}
        </Card.Header>
        <Card.Body>
          <Row>
            <Col>
              <img
                src={item.img}
                style={{
                  width: "80px",
                  height: "80px",
                  objectFit: "contain",
                }}
              />
            </Col>
          </Row>
          <Row className="mt-3 justify-content-center flex-nowrap g-0">
            <Col>
              <ButtonGroup className="w-100 flex-nowrap">
                {item.choices.map((choice, idx) => {
                  const uniqueId = `radio-${item.id}-${idx}`;
                  const isChecked = currentValue === choice;

                  return (
                    <ToggleButton
                      key={uniqueId}
                      id={uniqueId}
                      type="radio"
                      variant={isChecked ? "primary" : "outline-primary"}
                      name={`radio-group-${item.id}`}
                      value={choice}
                      checked={isChecked}
                      onChange={(e) => handleChange(e.currentTarget.value)}
                      className="d-flex align-items-center justify-content-center p-2"
                      style={{
                        fontSize: "0.85rem",
                        whiteSpace: "nowrap",
                        fontWeight: "bold",
                        height: "50px",
                      }}
                    >
                      {choice}
                    </ToggleButton>
                  );
                })}
              </ButtonGroup>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </>
  );
}

export default ClOption;
