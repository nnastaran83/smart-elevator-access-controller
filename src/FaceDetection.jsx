import React from 'react';
import ReactDOM from 'react-dom';
import * as faceapi from 'face-api.js';
import './FaceDetection.css';
import { Container, Header, Divider } from 'semantic-ui-react';



class FaceDetection extends React.Component {
  videoRef = React.createRef(null);
  canvasRef = React.createRef(null);
  state = { expressions: [], labeledDescriptors: [], match: "" };
  MODEL_URL = "/models";


  componentDidMount() {
    this.run();
  }


  log = (...args) => {
    console.log(...args);
  };



  run = async () => {
    this.log("run started");

    //load the models
    await Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri(this.MODEL_URL),
      faceapi.nets.faceLandmark68Net.loadFromUri(this.MODEL_URL),
      faceapi.nets.ssdMobilenetv1.loadFromUri(this.MODEL_URL),
      faceapi.nets.faceRecognitionNet.loadFromUri(this.MODEL_URL),
      faceapi.nets.faceExpressionNet.loadFromUri(this.MODEL_URL)

    ]).then(this.startVideo);

    const options = new faceapi.TinyFaceDetectorOptions({
      inputSize: 128,
      scoreThreshold: 0.5
    });

    const referenceImage = await faceapi.fetchImage('/people_images/6.jpg');
    const nastaran = await faceapi.computeFaceDescriptor(referenceImage, options);
    const labeledDescriptors = [
      new faceapi.LabeledFaceDescriptors(
        'Nastaran',
        [nastaran]
      )
    ];

    this.setState({ labeledDescriptors }, () => {
      //callback
      console.log(this.state.labeledDescriptors);
    });

  };



  startVideo = async () => {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then((stream) => {
        this.videoRef.current.srcObject = stream;
      })
      .catch((err) => {
        console.error(err);
      });
  };



  detectFace = async () => {
    this.setState({ match: "" });
    if (
      this.videoRef.current.paused ||
      this.videoRef.current.ended ||
      !faceapi.nets.tinyFaceDetector.params
    ) {
      setTimeout(() => this.detectFace());
      return;
    };

    const video = this.videoRef.current;
    const canvas = this.canvasRef.current;
    const displaySize = { width: video.videoWidth, height: video.videoHeight };

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    faceapi.matchDimensions(canvas, displaySize);

    const options = new faceapi.SsdMobilenetv1Options(
      {
        minConfidence: 0.8,
        maxResults: 1
      });

    const detectedFace = await faceapi.detectSingleFace(video, options).withFaceLandmarks().withFaceDescriptor();

    if (!detectedFace) {
      setTimeout(() => this.detectFace());
      return;
    } else {
      const resizedDetection = faceapi.resizeResults(detectedFace, displaySize);
      const faceMatcher = new faceapi.FaceMatcher(this.state.labeledDescriptors, 0.8);
      const bestMatch = faceMatcher.findBestMatch(detectedFace.descriptor);
      this.setState({ match: bestMatch.label });

      console.log(bestMatch);

      this.drawDetection(resizedDetection, bestMatch, canvas);

    }

    /* create FaceMatcher with automatically assigned labels
     from the detection results for the reference image*/
    const result = await faceapi
      .detectSingleFace(this.videoRef.current, options)
      .withFaceExpressions();

    if (result) {
      const expressions = [];
      for (const [key, value] of Object.entries(result.expressions)) {
        expressions.push([key, value]);
      }

      this.setState(() => ({ expressions }));
    }

    setTimeout(() => this.detectFace(), 1000);
  };


  drawDetection(resizedDetection, bestMatch, canvas) {
    /** 
     * Draw a rectangle around the detected face
    */
    const { top, left, width, height } = resizedDetection.detection.box;
    const drawOptions = {
      lineWidth: 1
    };
    const box = new faceapi.draw.DrawBox({ x: left+80, y: top, width, height }, drawOptions);

    box.draw(canvas);
  }

  render() {
    return (
      <div className='ui center aligned container'>

        <h2>Welcome</h2>
        
        <Divider hidden />
       
        <Divider hidden />

        <div className="video-container">
          <video
            ref={ this.videoRef }
            autoPlay
            muted
            onPlay={ this.detectFace }

          />
          <canvas ref={ this.canvasRef } />

        </div>

      </div >
    );
  }
}

export default FaceDetection;