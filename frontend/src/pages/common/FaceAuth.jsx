import { ImagePlus, LucideLoader, User2 } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import WebcamPreview from '../../components/WebcamPreview';
import OptionCard from '../../components/OptionCard';
import { loginUsingFaceAuth, registerUser } from '../../redux/slices/AuthSlice';
import { email } from 'zod';
import { toast } from 'react-toastify';
import { id } from 'zod/locales';

function FaceAuth() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [optionSelected, setOptionSelected] = useState(false)
  const [isSelfieOption, setIsSelfieOption] = useState(false)

  const [selectedImages, setSelectedImages] = useState({
    photoId: '',
    selfie: ''
  })
  const [photoIdPreview, setPhotoIdPreview] = useState(null);
  const [selfiePreview, setSelfiePreview] = useState(null);

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  const { isLoading, user, isRegistering, isUserVerified } = useSelector((state) => state.authSlice)

  useEffect(() => {
    if (!user) return;

    if (isRegistering) {
      if (!user.fullName || !user.email || !user.password) {
        toast.error("Something went wrong please restart Registration process");
        navigate('/auth');
      }
    } else {
      if (!isUserVerified && (!user.email || !user.password)) {
        toast.error("Something went wrong please restart Login process");
        navigate('/auth');
      }
    }
  }, [user, isRegistering, isUserVerified, navigate]);

  const handlePhotoIdAdd = (e) => {
    const addedFile = e.target.files[0]
    if (!addedFile) return;

    if (!addedFile.type.startsWith("image/")) {
      alert("Only image files are allowed!");
      return;
    }

    setSelectedImages(prev => ({ ...prev, photoId: addedFile }));
    console.log(selectedImages)

    if (addedFile) {
      setPhotoIdPreview(URL.createObjectURL(addedFile));
    }
  }
  const handleSelfieAdd = (e) => {
    const addedFile = e.target.files[0]
    if (!addedFile) return;

    if (!addedFile.type.startsWith("image/")) {
      alert("Only image files are allowed!");
      return;
    }

    setSelectedImages(prev => ({ ...prev, selfie: addedFile }));
    console.log(selectedImages)
    if (addedFile) {
      setSelfiePreview(URL.createObjectURL(addedFile));
    }
  }

  const handleSubmit = async () => {
    const { fullName, email, password } = user
    const { photoId, selfie } = selectedImages
    console.log("user", user)
    console.log("selectedImages", selectedImages)
    if (isRegistering) {
      if (
        !fullName ||
        !email ||
        !password
      ) return toast.error("All input Fields are Required")

      if (!photoId || !selfie) return toast.error(`${isRegistering ? "Both images are required" : "Image is Required"}`)
    } else {
      if (!selfie) return toast.error("Image is Required")

    }


    const userData = new FormData()

    userData.append("fullName", fullName);
    userData.append("email", email);
    userData.append("password", password);
    userData.append("idImage", photoId);
    userData.append("selfie", selfie);

    if (isRegistering) {
      const response = await dispatch(registerUser(userData))
      if (registerUser.fulfilled.match(response)) {
        toast.success("Your Account Has been Registered Successfully")
        navigate('/')
        return
      } else if (registerUser.rejected.match(response)) {
        toast.error(response.payload.message)
      }
    } else {
      const response = await dispatch(loginUsingFaceAuth(userData))
      if (loginUsingFaceAuth.fulfilled.match(response)) {
        toast.success("Logged in Successfully")
        if (response.payload.user.role === "admin") {
          navigate('/admin')
        } else {
          navigate('/')
        }
        return
      } else if (loginUsingFaceAuth.rejected.match(response)) {
        toast.error(response.payload.message)
      }
    }
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen w-full bg-gray-50 px-6 py-6 gap-6">
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 text-center">
          {isRegistering ? "Add Proofs for Face Verification" : "Verify User Using Face Authentication"}
        </h1>
        <p className="text-red-600 text-center mt-4 text-sm md:text-base">
          ⚠️ <span className="font-semibold underline decoration-red-700 underline-offset-2">
            Do not leave or reload
          </span> the page. Your uploads will be lost and you’ll have to restart the{" "}
          {isRegistering ? "registration" : "login"} process.
        </p>

      </div>

      <div className={`grid items-center md:gap-12 w-full ${isRegistering ? "md:grid-cols-[1fr_auto_1fr] max-w-5xl" : "max-w-xl"}`}>

        {isRegistering &&
          <>
            < div className="space-y-3 my-10 mb-20">
              <p className="text-gray-600 font-medium">Photo ID (Passport or Government ID)</p>
              <label htmlFor="photoId" className="block cursor-pointer aspect-video rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-all">
                <input
                  accept="image/*"
                  onChange={(e) => { handlePhotoIdAdd(e) }}
                  type="file"
                  name="photoId"
                  id="photoId"
                  className="hidden"
                />
                {photoIdPreview ?
                  <img src={photoIdPreview} alt="" className='w-full' />
                  :
                  <div className="w-full h-full bg-indigo-100 flex justify-center items-center">
                    <ImagePlus className="text-indigo-600 size-8" />
                  </div>
                }

              </label>
            </div>

            <div className="hidden md:block w-1 bg-indigo-500 rounded-full h-full"></div>
          </>
        }

        <div className='my-10'>
          {/* Selfie / Webcam */}
          {optionSelected && isSelfieOption ? (
            <div className="space-y-3">
              <div className='flex justify-between'>
                <p className="text-gray-600 font-medium">Take Selfie</p>
                <button onClick={() => setOptionSelected(false)} className='bg-indigo-500 px-3 py-0.5 rounded-3xl text-white'>Choose again</button>
              </div>
              <WebcamPreview onCapture={(file) => setSelectedImages(prev => ({ ...prev, selfie: file }))} />
            </div>

          ) : optionSelected && !isSelfieOption ? (
            <div className="space-y-3">
              <div className='flex justify-between'>
                <p className="text-gray-600 font-medium">Choose A Selfie or Photo</p>
                <button onClick={() => setOptionSelected(false)} className='bg-indigo-500 px-3 py-0.5 rounded-3xl text-white'>Choose again</button>
              </div>
              <label htmlFor="selfie" className="block cursor-pointer aspect-video rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-all">
                <input
                  accept="image/*"
                  onChange={(e) => handleSelfieAdd(e)}
                  type="file"
                  name="selfie"
                  id="selfie"
                  className="hidden"
                />
                {selfiePreview ?
                  <img src={selfiePreview} alt="" className='w-full' />
                  :
                  <div className="w-full h-full bg-indigo-100 flex justify-center items-center">
                    <ImagePlus className="text-indigo-600 size-8" />
                  </div>
                }
              </label>
            </div>
          ) : (
            <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-6 w-full">
              <OptionCard
                title="Selfie Image"
                icon={<User2 className="text-indigo-600 size-8" />}
                onClick={() => {
                  setOptionSelected(true);
                  setIsSelfieOption(false);
                }}
              />
              <p className="text-lg text-gray-500">or</p>
              <OptionCard
                title="Take a Selfie"
                icon={<ImagePlus className="text-indigo-600 size-8" />}
                onClick={() => {
                  setOptionSelected(true);
                  setIsSelfieOption(true);
                }}
              />
            </div>
          )}
        </div>
      </div>

      <button
        onClick={handleSubmit}
        className={`px-6 py-2 border rounded-3xl text-white flex gap-2 items-center justify-center ${isLoading
          ? "bg-indigo-500 cursor-not-allowed opacity-70"
          : "bg-indigo-800 hover:bg-indigo-700"
          }`}
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <LucideLoader className='animate-spin size-4' /> Verifying user
          </>
        ) : (
          isRegistering ? "Verify and Register" : "Verify and Login"
        )}
      </button>
    </main >

  )
}

export default FaceAuth