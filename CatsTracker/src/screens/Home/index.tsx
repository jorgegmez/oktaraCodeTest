import React from 'react';
import { SafeAreaView, StatusBar, View, Image, FlatList } from 'react-native';
import { connect } from 'react-redux';
import { Formik } from 'formik';
import _ from 'lodash';
import { colorsGlobal as colors, imagesGlobal as images, stringsHome, imagesGlobal, stringsCat, icons } from '@constants';
import {
  Titles,
  MainButton,
  CustomHeader,
  Loading,
  RegisterForm,
  Input,
  ProfilePicture,
  StepButton,
  Icon,
  BodyText,
  Card,
  ThinButton,
} from '@components';
import { handleSelectProfileImage } from '@helpers/handlerProfilePicture';
import { registerCatInfoRegisterAction } from '@state/global/user/actions';
import * as userSelectors from '@state/global/user/selector';
import { handleRegisterCat, handleDeleteCat } from '@helpers/handlerCatsData';
import { catRegisterSchema } from './schema';

import styles from './styles';
import { ScrollView } from 'react-native-gesture-handler';

type IconConfig = {
  size?: number;
  color?: string;
  type: string;
};

type Props = {
  titleScreen: string;
  userInfo: UserStateModel;
  catInfo: CatStateModel;
  registerCatInfoRegister: (cat: CatPet[]) => void;
};

type State = {
  themeOfButton: 'blue' | 'white' | 'gray';
  userProfileImage?: string;
  setProfilePicture: boolean;
  loading: boolean;
  isCatSelect: boolean;
  currentCatId: string;
};

class Home extends React.PureComponent<Props, State> {
  static navigationOptions = {
    headerTitle: () => <Image source={images.CAT} style={styles.headerCat} />,
    headerRigth: () => <Icon config={{ ...icons.HAMBURGER_MENU, size: 20, color: colors.WHITE }} />,
  };

  state: State = {
    themeOfButton: 'blue',
    userProfileImage: '',
    setProfilePicture: false,
    loading: false,
    isCatSelect: false,
    currentCatId: '',
  };

  private selectProfileImage = async (fileName?: string) => {
    const { setProfilePicture } = this.state;
    const imageFile = handleSelectProfileImage({
      fileName,
    });

    if (imageFile) {
      this.setThumbnailImage(await imageFile);
      this.setState({
        loading: false,
        setProfilePicture: !setProfilePicture,
      });
    }
  };

  private setThumbnailImage = (imageUri?: string) => {
    this.setState({
      loading: true,
      userProfileImage: imageUri,
    });
  };

  public handleRegisterCatMethod = async ({ name, breed, age, description, picture }: CatPet) => {
    const {
      registerCatInfoRegister,
      userInfo: {
        data: { myCats },
      },
    } = this.props;
    console.log('handleRegisterCat --> name', name);
    if (name && breed && age && description && picture) {
      const cats = handleRegisterCat({ name, breed, age, description, picture }, myCats);
      registerCatInfoRegister(cats);
    }
  };

  showCatDescription = (catId: string) => {
    const { isCatSelect } = this.state;
    this.setState({
      isCatSelect: !isCatSelect,
      currentCatId: catId,
    });
  };

  deleteCat = (catId?: string) => {
    const {
      userInfo: {
        data: { myCats },
      },
      registerCatInfoRegister,
    } = this.props;
    const newCats = handleDeleteCat(catId, myCats);
    registerCatInfoRegister(newCats);
  };

  handleCatLocation = () => {
    // add logic
  };

  render() {
    const { themeOfButton, userProfileImage, loading, isCatSelect, currentCatId } = this.state;
    const {
      userInfo: {
        data: { myCats = [] },
      },
    } = this.props;
    const imagePlacement = userProfileImage
      ? {
          uri: userProfileImage,
        }
      : imagesGlobal.ICON_CAT_AVATAR;
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar backgroundColor={colors.PRIMARY} barStyle="light-content" />
        <View>
          {!myCats.length ? (
            <View>
              <Titles.H1 customStyle={styles.homeHaveCatsSubTitle} text={stringsCat.REGISTER_HAVE_CATS_SUBTIBLE} bold />
              <View style={styles.cardContainer}>
                <FlatList
                  data={[
                    {
                      id: 'cat-1',
                      name: 'fito',
                      breed: 'siames',
                      description: 'small',
                      age: 2,
                      picture: imagePlacement,
                    },
                    {
                      id: 'cat-2',
                      name: 'Noah',
                      breed: 'siames',
                      description: 'small',
                      age: 3,
                      picture: imagePlacement,
                    },
                    {
                      id: 'cat-3',
                      name: 'Pelos',
                      breed: 'siames',
                      description: 'small',
                      age: 1,
                      picture: imagePlacement,
                    },
                    {
                      id: 'cat-4',
                      name: 'Manchas',
                      breed: 'siames',
                      description: 'small',
                      age: 5,
                      picture: imagePlacement,
                    },
                  ]}
                  renderItem={cat => (
                    <View style={styles.stepButtonContainer}>
                      <StepButton
                        sufixComponent={<Image style={styles.imageButton} source={cat.item.picture} />}
                        customButtonStyle={styles.stepButton}
                        rigthIcon={
                          isCatSelect && currentCatId === cat.item.id
                            ? {
                                ...icons.ARROW_DOWN_THIN,
                                color: colors.DARK_GRAY,
                                size: 22,
                              }
                            : {
                                ...icons.ARROW_RIGHT,
                                color: colors.DARK_GRAY,
                                size: 22,
                              }
                        }
                        showRigthIcon
                        theme="cream"
                        text={`${cat.item.name}`}
                        customTextStyle={styles.stepButtonText}
                        onPress={() => this.showCatDescription(cat.item.id)}
                      />
                      {isCatSelect && currentCatId === cat.item.id && (
                        <Card theme="grey">
                          <View style={styles.catInfoContainer}>
                            <Titles.H3 customStyle={styles.catInfoLabels} text={stringsCat.HOME_CAT_BREED_LABEL} bold />
                            <BodyText customStyle={styles.catInfoText} text={cat.item.breed} />
                          </View>
                          <View style={styles.catInfoContainer}>
                            <Titles.H3 customStyle={styles.catInfoLabels} text={stringsCat.HOME_CAT_AGE_LABEL} bold />
                            <BodyText customStyle={styles.catInfoText} text={`${cat.item.age} years old`} />
                          </View>
                          <View style={styles.catInfoContainer}>
                            <Titles.H3 customStyle={styles.catInfoLabels} text={stringsCat.HOME_CAT_DESCRIPTION_LABEL} bold />
                            <BodyText customStyle={styles.catInfoText} text={cat.item.description} />
                          </View>
                          <View style={styles.buttonsContainer}>
                            <ThinButton
                              onPress={this.deleteCat}
                              customStyleLinkText={styles.linkButtonDelete}
                              text={stringsCat.HOME_CAT_DELETE_BUTTON}
                            />
                            <ThinButton
                              onPress={this.handleCatLocation}
                              customStyleLinkText={styles.linkButtonLocate}
                              text={stringsCat.HOME_CAT_LOCATE_BUTTON}
                            />
                          </View>
                        </Card>
                      )}
                    </View>
                  )}
                />
              </View>
            </View>
          ) : (
            <ScrollView bounces={false}>
              <CustomHeader
                logo={imagesGlobal.ICON_SAD_CAT}
                title={stringsHome.HOME_NO_CATS_TITLE_TEXT}
                info={stringsHome.HOME_NO_CATS_SUBTITLE_TEXT}
              />
              <RegisterForm customTextStyle={styles.customTextStyle} theme="white">
                <Formik
                  initialValues={{
                    id: '',
                    name: '',
                    breed: '',
                    age: 0,
                    description: '',
                    picture: imagePlacement,
                  }}
                  validationSchema={catRegisterSchema}
                  onSubmit={this.handleRegisterCatMethod}
                >
                  {props => (
                    <View>
                      <View style={styles.firstSectionHeaderStyle}>
                        <ProfilePicture image={imagePlacement} onImageSelected={() => this.selectProfileImage('picture')} />
                      </View>
                      <View style={styles.secondSectionHeaderStyle}>
                        <Input
                          onChange={props.handleChange('name')}
                          onBlur={props.handleBlur('name')}
                          type="normal"
                          label={stringsCat.REGISTER_CAT_NAME_TEXT}
                          hasError={!!props.errors.name}
                        />
                        <Input
                          onChange={props.handleChange('breed')}
                          onBlur={props.handleBlur('breed')}
                          type="normal"
                          label={stringsCat.REGISTER_CAT_BREED_TEXT}
                          hasError={!!props.errors.breed}
                        />
                        <Input
                          onChange={props.handleChange('age')}
                          onBlur={props.handleBlur('age')}
                          type="numeric"
                          label={stringsCat.REGISTER_CAT_AGE_TEXT}
                          hasError={!!props.errors.age}
                        />
                        <Input
                          onChange={props.handleChange('description')}
                          onBlur={props.handleBlur('description')}
                          type="normal"
                          label={stringsCat.REGISTER_CAT_DESCRIPTION_TEXT}
                          hasError={!!props.errors.description}
                        />
                      </View>
                      <View style={styles.buttonContainer}>
                        <MainButton
                          theme={themeOfButton}
                          text={stringsCat.REGISTER_CAT_BUTTON_TEXT}
                          testID={_.uniqueId()}
                          customButtonStyle={styles.mainButton}
                          onPress={props.handleSubmit}
                        />
                      </View>
                    </View>
                  )}
                </Formik>
              </RegisterForm>
            </ScrollView>
          )}
        </View>
        <Loading showModal={loading} />
      </SafeAreaView>
    );
  }
}

const mapStateToProps = (state: RootState) => ({
  userInfo: userSelectors.UserSelector(state),
});

const mapDispatchToProps = (dispatch: DispatchRSSA) => ({
  registerCatInfoRegister: (pet: CatPet[]) => dispatch(registerCatInfoRegisterAction(pet)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Home);
