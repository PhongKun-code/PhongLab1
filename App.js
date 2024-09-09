import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, Button, Dimensions, useWindowDimensions, StatusBar, Image, KeyboardAvoidingView, Platform } from 'react-native';
import { Calendar } from 'react-native-calendars';

const App = () => {
  const [day, setDay] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedDateInfo, setSelectedDateInfo] = useState('');
  const [isPortrait, setIsPortrait] = useState(true);
  const [statusBarStyle, setStatusBarStyle] = useState('dark-content');
  const [backgroundColor, setBackgroundColor] = useState('#32CD32'); // Màu nền xanh lá cây

  const { width, height } = useWindowDimensions();
  const buttonWidth = width / 2 - 20; // Tính toán chiều rộng cho mỗi nút bấm, trừ khoảng cách giữa các nút
  const calendarWidth = isPortrait ? width * 0.9 : width * 0.8;

  // Kích thước hình ảnh
  const imageWidth = width * 0.8;
  const imageHeight = imageWidth * (3 / 4); // Tỷ lệ chiều cao 3:4

  useEffect(() => {
    const handleDimensionChange = ({ window }) => {
      const portrait = window.height > window.width;
      setIsPortrait(portrait);

      // Cập nhật kiểu chữ của thanh trạng thái và màu nền dựa trên hướng màn hình
      if (portrait) {
        setStatusBarStyle('dark-content');
        setBackgroundColor('#32CD32'); // Màu nền xanh lá cây khi ở chế độ dọc
      } else {
        setStatusBarStyle('light-content');
        setBackgroundColor('#004d00'); // Màu nền xanh lá cây đậm khi ở chế độ ngang
      }
    };

    const subscription = Dimensions.addEventListener('change', handleDimensionChange);

    return () => {
      subscription?.remove();
    };
  }, []);

  const isValidDate = (d, m, y) => {
    const date = new Date(y, m - 1, d);
    return date.getFullYear() === y && date.getMonth() === m - 1 && date.getDate() === d;
  };

  const handleDateChange = () => {
    if (day && month && year) {
      const dayNum = parseInt(day, 10);
      const monthNum = parseInt(month, 10);
      const yearNum = parseInt(year, 10);

      if (isValidDate(dayNum, monthNum, yearNum)) {
        const formattedDate = `${yearNum}-${monthNum.toString().padStart(2, '0')}-${dayNum.toString().padStart(2, '0')}`;
        setSelectedDate(formattedDate);
      } else {
        alert('Ngày, tháng hoặc năm không hợp lệ.');
      }

      setDay('');
      setMonth('');
      setYear('');
    }
  };

  const handleAnotherAction = () => {
    // Thực hiện hành động khác ở đây
    alert('Đã nhấn nút khác!');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <View style={[styles.innerContainer, { backgroundColor }]}>
        <StatusBar barStyle={statusBarStyle} backgroundColor={backgroundColor} />
        <Text style={[styles.header, { fontSize: isPortrait ? 24 : 20 }]}>Lịch</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={[styles.input, { width: isPortrait ? '30%' : '20%' }]}
            placeholder="Ngày (DD)"
            value={day}
            onChangeText={setDay}
            keyboardType="numeric"
          />
          <TextInput
            style={[styles.input, { width: isPortrait ? '30%' : '20%' }]}
            placeholder="Tháng (MM)"
            value={month}
            onChangeText={setMonth}
            keyboardType="numeric"
          />
          <TextInput
            style={[styles.input, { width: isPortrait ? '30%' : '20%' }]}
            placeholder="Năm (YYYY)"
            value={year}
            onChangeText={setYear}
            keyboardType="numeric"
          />
        </View>
        <View style={[styles.buttonContainer, { flexDirection: isPortrait ? 'column' : 'row' }]}>
          <Button title="Xem Ngày" onPress={handleDateChange} style={{ width: isPortrait ? '100%' : buttonWidth }} />
          <Button title="Hành Động Khác" onPress={handleAnotherAction} style={{ width: isPortrait ? '100%' : buttonWidth }} />
        </View>
        <Calendar
          current={selectedDate}
          onDayPress={(day) => {
            const date = new Date(day.dateString);
            const formattedDate = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
            setSelectedDateInfo(formattedDate);
          }}
          style={[styles.calendar, { width: calendarWidth }]}
          markedDates={{
            [selectedDate]: {
              selected: true,
              selectedColor: 'blue',
              selectedTextColor: 'white',
              dotColor: 'red',
              activeOpacity: 0.8,
            },
          }}
          theme={{
            selectedDayBackgroundColor: 'blue',
            selectedDayTextColor: 'white',
            todayTextColor: 'orange',
            dayTextColor: 'black',
            monthTextColor: 'black',
          }}
        />
        {selectedDateInfo ? (
          <Text style={[styles.dateInfo, { fontSize: isPortrait ? 18 : 16 }]}>Ngày đã chọn: {selectedDateInfo}</Text>
        ) : null}
        {/* Thêm hình ảnh */}
        <Image
          source={require('./assets/images.jpg')} // Đảm bảo đường dẫn chính xác đến hình ảnh của bạn
          style={[styles.image, { width: imageWidth, height: imageHeight }]}
        />
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  innerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  header: {
    marginBottom: 20,
    fontFamily: 'Roboto',
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    margin: 5,
    paddingHorizontal: 10,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row', // Mặc định là ngang
    justifyContent: 'space-between',
    width: '80%',
    marginBottom: 20,
  },
  calendar: {
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 10,
    marginTop: 20,
  },
  dateInfo: {
    marginTop: 20,
    color: 'black',
  },
  image: {
    marginTop: 20,
    borderRadius: 10,
  },
});

export default App;
