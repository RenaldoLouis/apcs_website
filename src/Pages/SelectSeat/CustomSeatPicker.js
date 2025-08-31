import { Button, Tooltip, Typography } from 'antd';

const { Text } = Typography;

const CustomSeatPicker = ({ layout, selectedSeats, onSelect, onDeselect, maxSeats }) => {

    const handleSeatClick = (seat) => {
        const isSelected = selectedSeats.some(s => s.id === seat.id);

        if (isSelected) {
            onDeselect(seat);
        } else {
            if (selectedSeats.length < maxSeats) {
                onSelect(seat);
            } else {
                // Optional: message.warn(`You can only select a maximum of ${maxSeats} seats.`);
            }
        }
    };

    if (!layout || layout.length === 0) {
        return <Text>No seat layout available for this section.</Text>;
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            {layout.map((row, rowIndex) => (
                <div key={rowIndex} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    {/* The Correct Row Label */}
                    <div style={{ width: '25px', textAlign: 'center' }}>
                        <Text strong>{row[0].id.split('-')[1].charAt(0)}</Text>
                    </div>

                    {/* The Seats */}
                    <div style={{ display: 'flex', gap: '5px' }}>
                        {row.map((seat, seatIndex) => {
                            if (!seat) return <div key={seatIndex} style={{ width: '32px' }} />; // Aisle spacer

                            const isSelected = selectedSeats.some(s => s.id === seat.id);

                            return (
                                <Tooltip key={seat.id} title={seat.tooltip}>
                                    <Button
                                        style={{
                                            width: '32px',
                                            padding: 0,
                                            borderColor: isSelected ? '#1890ff' : (seat.isReserved ? '#f5222d' : undefined),
                                            backgroundColor: isSelected ? '#1890ff' : (seat.isReserved ? '#fff1f0' : '#ffffff'),
                                            color: isSelected ? '#ffffff' : (seat.isReserved ? '#f5222d' : undefined)
                                        }}
                                        disabled={seat.isReserved}
                                        onClick={() => handleSeatClick(seat)}
                                    >
                                        {seat.number}
                                    </Button>
                                </Tooltip>
                            );
                        })}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default CustomSeatPicker;