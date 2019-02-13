import NewJobs, { ChooseSpecs } from '../components/newJobs/newJobs';
import Stepper from '../components/newJobs/Stepper';
import './components/newJobs/helpers.js';
import React from 'react';

describe('New Jobs Page', () => {
 
  // it('calls componentDidMount once', () => {
  //   sinon.spy(NewJobs.prototype, 'componentDidMount');

  //   const wrapperCDM = mount(<NewJobs />)
  //   expect(NewJobs.prototype.componentDidMount.calledOnce).to.equal(true)
  // })

  it('index state should change when changeIndex is called', () => {
    const wrapper = shallow(<NewJobs />)
    const instance = wrapper.instance()
  
    instance.changeIndex('ndsi')

    expect(wrapper.state('index')).to.equal('ndsi');
  });

  it('stepper component should mount', () => {
    const wrapper = mount(<NewJobs />)
    let stepperWrapper = wrapper.find('Stepper')
    console.log(stepperWrapper)

    expect(stepperWrapper.find('Stepper')).to.have.length(1);
  })

  it('choose index should mount on step 0', () => {
    // sinon.spy(NewJobs.prototype, 'changeIndex')
    // sinon.spy(NewJobs.prototype, 'handleSpecChange')
    // sinon.spy(NewJobs.prototype, 'updateSelectedSpec')
    // sinon.spy(NewJobs.prototype, 'submitJob')
    // sinon.spy(NewJobs.prototype, 'updateSelectedFiles')
    // sinon.spy(NewJobs.prototype, 'handleInputUpload')
    // sinon.spy(NewJobs.prototype, 'closeDialog')
    
    // const wrapper = mount(<NewJobs />)

    // const wrapperl = mount(
      // <Stepper
      //   index='aci'
      //   changeIndex={NewJobs.prototype.changeIndex}
      //   onSpecChange={NewJobs.prototype.handleSpecChange}
      //   updateSelectedSpec={NewJobs.prototype.updateSelectedSpec}
      //   submitJob={NewJobs.prototype.submitJob}
      //   updateSelectedFiles={NewJobs.prototype.updateSelectedFiles}
      //   handleInputUpload={NewJobs.prototype.handleInputUpload}
      //   closeDialog={NewJobs.prototype.closeDialog}
      //   specParams={wrapper.state('specParamsByIndex')}
      //   selectedSpec={wrapper.state('selectedSpec')}
        // specs={wrapper.state('indexedSpecs')}
        // submitDisabled={wrapper.state('submitDisabled')}
    //     allFiles={wrapper.state('allFiles')}
    //     selectedFiles={wrapper.state('selectedFiles')}
    //     dialog={wrapper.state('dialog')}
    //     message={wrapper.state('message')}
    //   />
    // )

         
    // wrapperl.setState({activeStep: 0})
    // let indexWrapper = wrapperl.find('ChooseIndex')
    // console.log(wrapperl.children().name)


    // let stepperWrapper = wrapper.find('Stepper')
    // expect(indexWrapper.find('ChooseIndex')).to.have.length(1);
    // let stepperWrapper = mount(<Stepper />)
    // let indexWrapper = wrapper.find('ChooseIndex')
    // expect(indexWrapper.find('ChooseIndex')).to.have.length(1);
    
    
    // const stepperWrapper = mount(<Stepper />)
    // let stepperInstance = stepperWrapper.instance()

    // stepperInstance.setState({ activeStep: 0 })
    // let indexWrapper = stepperWrapper.find('ChooseIndex')


    // expect(indexWrapper.find('ChooseIndex').to.have.length(1))
  })
});