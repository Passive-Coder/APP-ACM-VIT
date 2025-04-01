import React, { useState, useEffect } from 'react';
import { TouchableOpacity, Text, View, FlatList, TextInput, Alert, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { CheckBox } from 'react-native-elements';
const Stack = createStackNavigator();
const HomeScreen = ({ navigation }) => {
  const [currentUser, setcurrentUser] = useState('');
  const loadCurrentUser = async () => {
    const userr = await AsyncStorage.getItem('currentUser');
    setcurrentUser(userr);
  };
  useEffect(() => {
    loadCurrentUser();
  }, []);
  return (
    <View
    style={{
      flex: 1,
      backgroundColor:'purple'
    }}>
      <Text
      style={{
        fontWeight: 'bold',
        color: 'white',
        fontSize: 42,
        marginTop: 15,
        marginHorizontal: 10,
        marginBottom: 0
      }}>
        Hello {currentUser}!
      </Text>
      <Text
      style={{
        fontWeight: 'bold',
        color: 'white',
        fontSize: 30,
        margin: 15
      }}>
        What you want to do?
      </Text>
      <View
      style={{
        flex: 1, 
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <TouchableOpacity
        style={{
          backgroundColor: 'rgb(44, 117, 255)',
          borderStyle: 'dotted',
          borderRadius: 30,
          marginVertical: 5,
          padding: 10,  
          flex: 1,
          height: '90%',
          width:'90%',
          alignItems: 'center',
          justifyContent: 'center'      
        }}
        onPress={() => navigation.navigate('Set')} // Navigate to Set screen
      >
        <Text
        style={{
          fontSize: 36,
          fontWeight: 'bold',
          color: 'white'
        }}>Create Questions</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={{
          backgroundColor: 'rgb(34, 177, 76)',
          borderStyle: 'dotted',
          marginVertical: 5,
          borderRadius: 30,
          padding: 10,
          height: '90%',
          flex: 1,
          width: '90%',
          alignItems: 'center',
          justifyContent: 'center'
        }}
        onPress={() => navigation.navigate('Quiz')} // Navigate to Quiz screen
      >
        <Text
        style={{
          fontSize: 36,
          fontWeight: 'bold',
          color: 'white'
        }}>Take Quiz</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={{
          backgroundColor: 'rgb(220, 20, 60)',
          marginVertical: 5,
          borderRadius: 30,
          padding: 10,
          height: '90%',
          flex: 1,
          width: '90%',
          alignItems: 'center',
          justifyContent: 'center'
        }}
        onPress={() => navigation.navigate('Delete')} // Navigate to Quiz screen
      >
        <Text
        style={{
          fontSize: 36,
          fontWeight: 'bold',
          color: 'white'
        }}>Delete Questions</Text>
      </TouchableOpacity>
    </View>
    <View style={{
      flex: 0.02
    }}/>
    </View>
  );
};

const Question = ({ question, options, onSelectAnswer }) => {
  return (
    <View style={{ marginBottom: 20
    }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold' ,color:'white' }}>{question}</Text>
      <View
      style={{
        flex: 1,
        flexDirection: 'row'
      }}>
      <TouchableOpacity
          key={0}
          onPress={() => onSelectAnswer(options[0])}
          style={{
            flex:1,
            padding: 10,
            paddingVertical: 20,
            backgroundColor: 'rgb(247, 50, 50)',
            marginVertical: 5,
            marginHorizontal: 2,
            borderRadius: 5,
          }}
        >
          <Text style={{color: 'white', fontWeight: 'bold'}}>{options[0]}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          key={1}
          onPress={() => onSelectAnswer(options[1])}
          style={{
            flex: 1,
            padding: 10,
            paddingVertical: 20,
            backgroundColor: 'rgb(18, 64, 248)',
            marginVertical: 5,
            marginHorizontal: 2,
            borderRadius: 5,
          }}
        >
          <Text
          style={{
            color: 'white',
            fontWeight: 'bold'
          }}>{options[1]}</Text>
        </TouchableOpacity>
        </View>
        <View 
        style={{
          flex: 1,
          flexDirection: 'row'
        }}>
        <TouchableOpacity
          key={2}
          onPress={() => onSelectAnswer(options[2])}
          style={{
            flex: 1,
            padding: 10,
            paddingVertical: 20,
            backgroundColor: 'rgb(255, 180, 6)',
            marginVertical: 5,
            marginHorizontal: 2,
            borderRadius: 5,
          }}
        >
          <Text style={{
            color: 'white',
            fontWeight: 'bold'
          }}>{options[2]}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          key={3}
          onPress={() => onSelectAnswer(options[3])}
          style={{
            flex: 1,
            padding: 10,
            paddingVertical: 20,
            backgroundColor: 'rgb(80, 162, 3)',
            marginVertical: 5,
            marginHorizontal: 2,
            borderRadius: 5,
          }}
        >
          <Text
          style={{
            color: 'white',
            fontWeight: 'bold'
          }}>{options[3]}</Text>
        </TouchableOpacity>
        </View>
    </View>
  );
};
const QuizScreen = () => {
  const [currentUser, setcurrentUser] = useState('');
  const [questionsList, setQuestionsList] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState({});

  // Load current user
  const loadCurrentUser = async () => {
    try {
      const userr = await AsyncStorage.getItem('currentUser');
      setcurrentUser(userr || 'Guest'); // Default value if null
    } catch (error) {
      console.error("Error loading current user:", error);
    }
  };

  // Fetch questions from AsyncStorage
  const fetchQuestions = async () => {
    try {
      if (!currentUser) return;
      let questions = await AsyncStorage.getItem(`${currentUser} questions`);
      questions = questions ? JSON.parse(questions) : [];
      setQuestionsList(questions);
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  };

  // Load user on mount
  useEffect(() => {
    loadCurrentUser();
  }, []);

  // Fetch questions when user is loaded
  useEffect(() => {
    if (currentUser) {
      fetchQuestions();
    }
  }, [currentUser]);

  // Handle answer selection
  const handleAnswerSelection = (selectedAnswer, correctAnswer, questionIndex) => {
    if (selectedAnswer === correctAnswer) {
      setCorrectCount(prevCount => prevCount + 1);
    } else {
      setIncorrectCount(prevCount => prevCount + 1);
    }

    setAnsweredQuestions(prev => ({
      ...prev,
      [questionIndex]: true,
    }));
  };

  // Pagination logic
  const questionsToShow = questionsList.slice(currentIndex, currentIndex + 5);
  const hasNext = currentIndex + 5 < questionsList.length;

  return (
    <View style={{ flex: 1, padding: 20, backgroundColor: 'rgb(120,0,120)' }}>
      <Text style={{ color: 'white', fontSize: 30, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 }}>
        Quiz Questions
      </Text>

      {questionsList.length === 0 ? (
        <Text style={{ textAlign: 'center', color: 'white', fontWeight: 'bold' }}>No questions available. Please add some.</Text>
      ) : (
        <FlatList
          data={questionsToShow}
          keyExtractor={(item, index) => (currentIndex + index).toString()}
          renderItem={({ item, index }) => (
            <Question
              question={item.question}
              options={item.options}
              onSelectAnswer={(selectedAnswer) => handleAnswerSelection(selectedAnswer, item.correct, index)}
              disabled={answeredQuestions[index]}
            />
          )}
        />
      )}

      {/* Show next button only if there are more questions */}
      {hasNext && (
        <TouchableOpacity
          onPress={() => setCurrentIndex(prev => Math.min(prev + 5, questionsList.length - 1))}
          style={{ backgroundColor: 'rgb(18, 64, 248)', padding: 10, borderRadius: 5, marginTop: 10 }}
        >
          <Text style={{ color: 'white', textAlign: 'center', fontWeight:'bold', fontSize: 18 }}>Next</Text>
        </TouchableOpacity>
      )}

      {/* Display correct and incorrect answers count */}
      <View style={{ marginTop: 20, alignItems: 'center' }}>
        <Text style={{ fontSize: 16, color: 'white', fontWeight:'bold', marginBottom: 10 }}>✅ Correct: {correctCount}</Text>
        <Text style={{ fontSize: 16, color: 'white', fontWeight:'bold', marginBottom: 10 }}>❌ Incorrect: {incorrectCount}</Text>
      </View>
    </View>
  );
};

const SetScreen = () => {
  const [currentUser, setcurrentUser] = useState('');
  const loadCurrentUser = async () => {
    const userr = await AsyncStorage.getItem('currentUser');
    setcurrentUser(userr);
  };
  useEffect(() => {
    loadCurrentUser();
  }, []);
  const [question, setQuestion] = useState('');
  const [option1, setOption1] = useState('');
  const [option2, setOption2] = useState('');
  const [option3, setOption3] = useState('');
  const [option4, setOption4] = useState('');
  const [correctAnswer, setCorrectAnswer] = useState('');

  const allOptionsFilled = option1 && option2 && option3 && option4;
  
  const getFormattedData = async () => {
    const newQuestion = {
      question,
      options: [option1, option2, option3, option4],
      correct: correctAnswer,
    };

    try {
      let storedQuestions = await AsyncStorage.getItem(`${currentUser} questions`);
      storedQuestions = storedQuestions ? JSON.parse(storedQuestions) : [];
      let content = Object.values(storedQuestions);
      let permission = 1;
      for(let key in content){
        if(newQuestion.question === content['question']){
          Alert.alert('Cannot create duplicate questions');
          permission = 0;
          break;
        }
      }
      if(permission === 1){
        try{
        storedQuestions.push(newQuestion);
        await AsyncStorage.setItem(`${currentUser} questions`, JSON.stringify(storedQuestions));
  
        console.log('Question saved successfully:', newQuestion);
      } catch (error) {
        console.error('Error saving question:', error);
      }
      Alert.alert('Question Created Successfully', '');
      }
    }
    catch(error){
      console.error('Error fetching questions: ', error);
    }
  };
  return (
    <View style={{ flex: 1, padding: 20, justifyContent: 'center' }}>
      <TextInput
        placeholder="Start Typing your Question"
        placeholderTextColor='black'
        value={question}
        multiline={true}
        onChangeText={setQuestion}
        style={{
          borderWidth: 1,
          borderColor: 'grey',
          fontWeight:'bold',
          fontSize: 15,
          borderRadius: 5,
          padding: 10,
          marginBottom: 10,
          backgroundColor: 'white', // Ensure text input visibility
        }}
      />
      <View
        style={[styles.optionView, styles.red]}
      >
        <TextInput
          placeholder={`Add Answer 1`}
          placeholderTextColor="white"
          value={option1}
          onChangeText={setOption1}
          style={styles.optionTextBox}
        />
        <CheckBox
        checked={correctAnswer === option1}
        onPress={() => setCorrectAnswer(option1)} 
        />
    </View>
      <View
        style={[styles.optionView, styles.blue]}
      >
        <TextInput
          placeholder={`Add Answer 2`}
          placeholderTextColor="white"
          value={option2}
          onChangeText={setOption2}
          style={[styles.optionTextBox]}
        />
        <CheckBox
    checked={correctAnswer === option2}
    onPress={() => setCorrectAnswer(option2)} 
  />
      </View>
    <View
        style={[styles.optionView, styles.yellow]}
      >
        <TextInput
          placeholder={`Add Answer 3`}
          placeholderTextColor="white"
          value={option3}
          onChangeText={setOption3}
          style={[styles.optionTextBox]}
        />
        <CheckBox
    checked={correctAnswer === option3}
    onPress={() => setCorrectAnswer(option3)} 
  />
  </View>
      <View
        style={[styles.optionView, styles.green]}
      >
        <TextInput
          placeholder={`Add Answer 4`}
          placeholderTextColor="white"
          value={option4}
          onChangeText={setOption4}
          style={[styles.optionTextBox]}
        />
        <CheckBox
    checked={correctAnswer === option4}
    onPress={() => setCorrectAnswer(option4)} 
  />
      </View>
      <TouchableOpacity
        onPress={getFormattedData}
        style={{
          marginTop: 20,
          backgroundColor: 'blue',
          padding: 10,
          borderRadius: 5,
          alignItems: 'center',
        }}
      >
        <Text style={{ color: 'white', fontWeight: 'bold' }}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
};
const DeleteScreen = () => {
  const [currentUser, setCurrentUser] = useState('');
  const [questionsList, setQuestionsList] = useState([]);
  const [selectedIndices, setSelectedIndices] = useState(new Set());

  useEffect(() => {
    const loadCurrentUser = async () => {
      const userr = await AsyncStorage.getItem('currentUser');
      setCurrentUser(userr ? userr : '');
    };
    loadCurrentUser();
  }, []);

  const fetchQuestions = async () => {
    try {
      const questions = await AsyncStorage.getItem(`${currentUser} questions`);
      setQuestionsList(questions ? JSON.parse(questions) : []);
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchQuestions();
    }, [currentUser])
  );

  const toggleSelection = (question) => {
    setSelectedIndices((prevSelected) => {
      const newSet = new Set(prevSelected);
      newSet.has(question) ? newSet.delete(question) : newSet.add(question);
      return newSet;
    });
  };

  const removeSelectedQuestions = async () => {
    const updatedList = questionsList.filter(
      (item) => !selectedIndices.has(item.question)
    );
    setQuestionsList(updatedList);
    setSelectedIndices(new Set());
    try {
      await AsyncStorage.setItem(`${currentUser} questions`, JSON.stringify(updatedList));
    } catch (error) {
      console.error('Error updating questions:', error);
    }
  };

  const deleteAllQuestions = async () => {
    setQuestionsList([]);
    setSelectedIndices(new Set());
    try {
      await AsyncStorage.removeItem(`${currentUser} questions`);
    } catch (error) {
      console.error('Error deleting all questions:', error);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: 'white', padding: 20 }}>
      {questionsList.length === 0 ? (
        <Text style={{ textAlign: 'center', marginVertical: 20 }}>No Questions Available</Text>
      ) : (
        <FlatList
          data={questionsList}
          keyExtractor={(item) => item.question}
          renderItem={({ item }) => (
            <View
              style={{ flexDirection: 'row', alignItems: 'center', padding: 10, borderBottomWidth: 1, borderColor: '#ccc' }}
            >
              <CheckBox
                value={selectedIndices.has(item.question)}
                onValueChange={() => toggleSelection(item.question)}
              />
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={{ fontWeight: 'bold' }}>{item.question}</Text>
                <Text>Correct Answer: {item.correct}</Text>
              </View>
            </View>
          )}
        />
      )}
      <TouchableOpacity
        onPress={removeSelectedQuestions}
        disabled={selectedIndices.size === 0}
        style={{
          marginTop: 20,
          backgroundColor: selectedIndices.size > 0 ? 'red' : 'gray',
          padding: 10,
          borderRadius: 5,
          alignItems: 'center',
        }}
      >
        <Text style={{ color: 'white', fontWeight: 'bold' }}>Delete Selected</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={deleteAllQuestions}
        style={{
          marginTop: 10,
          backgroundColor: 'black',
          padding: 10,
          borderRadius: 5,
          alignItems: 'center',
        }}
      >
        <Text style={{ color: 'white', fontWeight: 'bold' }}>Delete All</Text>
      </TouchableOpacity>
    </View>
  );
};

const LoginScreen = ({ navigation }) => {  // Accept navigation prop
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [users, setUsers] = useState({});
  const [userNotFound, setUserNotFound] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const storedUsers = await AsyncStorage.getItem('users');
      setUsers(storedUsers ? JSON.parse(storedUsers) : {});
    } catch (error) {
      console.error('Error loading users:', error);
    }
  };

  const saveCurrentUser = async (username) => {
    try {
      await AsyncStorage.setItem('currentUser', username);
    } catch (error) {
      console.error('Error saving current user:', error);
    }
  };

  const handleLogin = async () => {
    if (!username) {
      Alert.alert('Error', 'Please enter a username');
      return;
    }

    if (users[username]) {
      setUserNotFound(false);
      if (users[username] === password) {
        await saveCurrentUser(username);
        Alert.alert('Success', `Welcome, ${username}!`);
        navigation.navigate('Home');  // Use navigation to move to Home screen
      } else {
        Alert.alert('Error', 'Invalid password');
      }
    } else {
      setUserNotFound(true);
    }
  };

  const handleSignup = async () => {
    if (!username || !password) {
      Alert.alert('Error', 'Username and password are required');
      return;
    }

    if (users[username]) {
      Alert.alert('Error', 'Username already exists');
      return;
    }

    const updatedUsers = { ...users, [username]: password };
    setUsers(updatedUsers);
    await AsyncStorage.setItem('users', JSON.stringify(updatedUsers));
    setUserNotFound(false);
    Alert.alert('Success', 'User registered successfully');
  };

  return (
    <View style={{ flex: 1, backgroundColor: 'white', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <TextInput
        style={{ width: '80%', borderBottomWidth: 1, marginBottom: 20, padding: 10 }}
        placeholder='Enter username'
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={{ width: '80%', borderBottomWidth: 1, marginBottom: 20, padding: 10 }}
        placeholder='Enter password'
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      
      {userNotFound && <Text style={{ color: 'red', marginBottom: 10 }}>User not found</Text>}
      
      <TouchableOpacity
        onPress={users[username] ? handleLogin : handleSignup}
        style={{ backgroundColor: 'purple', padding: 10, borderRadius: 5, marginBottom: 10 }}>
        <Text style={{ color: 'white', fontWeight: 'bold' }}>{users[username] ? 'Login' : 'Create Account'}</Text>
      </TouchableOpacity>
    </View>
  );
};
const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
      <Stack.Screen name="login" component={LoginScreen}/>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Quiz" component={QuizScreen} />
        <Stack.Screen name="Set" component={SetScreen} />
        <Stack.Screen name='Delete' component={DeleteScreen}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;

const styles = StyleSheet.create({
  optionView: {
    alignItems: 'center',
    justifyContent: 'space-between', // Ensures equal spacing
    marginVertical: 5,
    borderRadius: 5,
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingVertical: 10,  // Increase padding for consistent height
    marginHorizontal: 2,
    minHeight: 60,  // Ensure a minimum height for consistency
  },
  red: {
    backgroundColor: 'rgb(247, 50, 50)'
  },
  blue: {
    backgroundColor: 'rgb(18, 64, 248)'
  },
  green:{
    backgroundColor: 'rgb(80, 162, 3)'
  },
  yellow:{
    backgroundColor: 'rgb(255, 180, 6)'
  },
  optionTextBox: {
    flex: 1,
    color: 'white',
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 5,
    padding: 10,
    fontSize: 12,
    width: '100%',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 10
  }
});
