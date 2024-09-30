import React from "react";
import {
  Button,
  Row,
  Col,
  Image,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import { ChevronLeft, ChevronRight } from "lucide-react";

const NavigableRow = ({
  options,
  selectedItem,
  onSelect,
  startIndex,
  setStartIndex,
  itemKey,
  multiple = false,
  isItemAvailable = () => true,
}) => {
  const itemsPerRow = 4;
  const visibleOptions = options.slice(startIndex, startIndex + itemsPerRow);

  const isSelected = (item) => {
    if (multiple) {
      return selectedItem.includes(typeof item === "string" ? item : item.src);
    } else {
      return selectedItem === (typeof item === "string" ? item : item.src);
    }
  };

  return (
    <div className="d-flex align-items-center bg-light p-3 rounded">
      <Button
        variant="outline-secondary"
        onClick={() => setStartIndex(Math.max(0, startIndex - 1))}
        disabled={startIndex === 0}
        className="me-2"
      >
        <ChevronLeft size={24} />
      </Button>
      <Row className="g-2 flex-grow-1">
        {visibleOptions.map((item, index) => (
          <Col key={index} xs={3}>
            <OverlayTrigger
              placement="top"
              overlay={
                <Tooltip id={`tooltip-${index}`}>
                  {item.description || ""}
                </Tooltip>
              }
            >
              <Image
                src={typeof item === "string" ? item : item.src}
                alt={
                  typeof item === "string"
                    ? `Option ${startIndex + index + 1}`
                    : item.name
                }
                rounded
                className={`option ${isSelected(item) ? "selected" : ""}`}
                style={{
                  width: "100%",
                  height: "auto",
                  cursor: isItemAvailable(item) ? "pointer" : "not-allowed",
                  border: isSelected(item)
                    ? "3px solid #007bff"
                    : "1px solid #dee2e6",
                  opacity: isItemAvailable(item) ? 1 : 0.5,
                }}
                onClick={() => {
                  if (isItemAvailable(item)) {
                    onSelect(typeof item === "string" ? item : item.src);
                  }
                }}
              />
            </OverlayTrigger>
          </Col>
        ))}
      </Row>
      <Button
        variant="outline-secondary"
        onClick={() =>
          setStartIndex(Math.min(options.length - itemsPerRow, startIndex + 1))
        }
        disabled={startIndex + itemsPerRow >= options.length}
        className="ms-2"
      >
        <ChevronRight size={24} />
      </Button>
    </div>
  );
};

export default NavigableRow;
