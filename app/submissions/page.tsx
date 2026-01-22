'use client';

import { useState } from 'react';
import { Upload, Send, CheckCircle2, X } from 'lucide-react';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  usePostSubmissionsContactMutation,
  usePostSubmissionsArtistMutation,
} from '@/lib/redux/api/openapi.generated';

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  subject: z.string().min(1, 'Subject is required'),
  message: z
    .string()
    .min(10, 'Message must be at least 10 characters'),
});

const artistSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  instagram: z.string().optional(),
  portfolio: z
    .string()
    .url('Must be a valid URL')
    .optional()
    .or(z.literal('')),
  title: z.string().min(1, 'Project title is required'),
  description: z
    .string()
    .min(20, 'Description must be at least 20 characters'),
});

type ContactFormData = z.infer<typeof contactSchema>;
type ArtistFormData = z.infer<typeof artistSchema>;

export default function SubmissionsPage() {
  const [submissionType, setSubmissionType] = useState<
    'contact' | 'submit'
  >('submit');
  const [category, setCategory] = useState('dj');
  const [files, setFiles] = useState<File[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [submitContact, { isLoading: isContactLoading }] =
    usePostSubmissionsContactMutation();
  const [submitArtist, { isLoading: isArtistLoading }] =
    usePostSubmissionsArtistMutation();

  const contactForm = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: '',
      email: '',
      subject: '',
      message: '',
    },
  });

  const artistForm = useForm<ArtistFormData>({
    resolver: zodResolver(artistSchema),
    defaultValues: {
      name: '',
      email: '',
      instagram: '',
      portfolio: '',
      title: '',
      description: '',
    },
  });

  const categories = [
    {
      id: 'dj',
      label: 'Music & Artists',
      description: 'DJ Mixes, Original Tracks, Remixes, Performance, Sound Design',
    },
    {
      id: 'photographer',
      label: 'Photography',
      description: 'Photography, Visual Art, Photo Essays',
    },
    {
      id: 'designer',
      label: 'Design',
      description: 'Fashion, Graphics, Branding, Visual Identity',
    },
    {
      id: 'writer',
      label: 'Writing',
      description: 'Poetry, Essays, Journalism, Editorial',
    },
    {
      id: 'stylist',
      label: 'Styling',
      description: 'Fashion Styling, Creative Direction, Art Direction',
    },
    {
      id: 'other',
      label: 'Other',
      description: 'Other creative work, collaborations, or projects',
    },
  ];

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const onContactSubmit = async (data: ContactFormData) => {
    try {
      await submitContact({
        body: {
          name: data.name,
          email: data.email,
          subject: data.subject,
          message: data.message,
          submissionType: 'GENERAL',
        },
      }).unwrap();

      toast.success(
        "Message sent successfully! We'll get back to you soon."
      );

      setIsSubmitted(true);
      contactForm.reset();
      setTimeout(() => setIsSubmitted(false), 5000);
    } catch (error) {
      const err = error as { data?: { message?: string } };
      toast.error(
        err?.data?.message || 'Failed to submit. Please try again.'
      );
    }
  };

  const onArtistSubmit = async (data: ArtistFormData) => {
    try {
      await submitArtist({
        body: {
          name: data.name,
          email: data.email,
          role: category,
          bio: data.description,
          portfolioLinks: data.portfolio
            ? { website: data.portfolio }
            : undefined,
          socialMedia: data.instagram
            ? { instagram: data.instagram }
            : undefined,
          pitchMessage: data.title + '\n\n' + data.description,
          attachments:
            files.length > 0 ? files.map((f) => f.name) : undefined,
        },
      }).unwrap();

      toast.success(
        "Application submitted successfully! We'll review it and get back to you."
      );

      setIsSubmitted(true);
      artistForm.reset();
      setFiles([]);
      setTimeout(() => setIsSubmitted(false), 5000);
    } catch (error) {
      const err = error as { data?: { message?: string } };
      toast.error(
        err?.data?.message || 'Failed to submit. Please try again.'
      );
    }
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen w-full bg-[#050507]">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-linear-to-b from-[#0a0a0f] to-[#050507] pb-20 md:pb-32 py-32 md:py-48 lg:py-56 px-4 md:px-8 lg:px-16">
        {/* Ambient blurs */}
        <div
          className="absolute bg-[#5b4fed] blur-[250px] right-[20%] opacity-[0.08] rounded-full w-[500px] h-[500px] top-0 animate-pulse"
          style={{ animationDuration: '6s' }}
        />
        <div
          className="absolute bg-[#1ecbe1] blur-[200px] left-[10%] opacity-[0.06] rounded-full w-[400px] h-[400px] bottom-0 animate-pulse"
          style={{ animationDuration: '8s' }}
        />

        <div className="max-w-[1440px] mx-auto relative z-10">
          <div className="max-w-[900px] mx-auto text-center space-y-6">
            {/* Badge */}
            {/* <div className="inline-flex items-center justify-center">
              <div className="bg-[rgba(255,255,255,0.1)] backdrop-blur-md border border-[rgba(255,255,255,0.2)] px-5 py-2 rounded-sm">
                <span className="text-[12px] text-white uppercase tracking-[0.15em] font-medium">
                  Submissions
                </span>
              </div>
            </div> */}

            {/* Heading */}
            <h1 className="text-[48px] md:text-[64px] lg:text-[80px] text-white leading-[1.05] tracking-[-0.03em] font-semibold uppercase">
              Submissions
            </h1>

            {/* Description */}
            <p className="text-[17px] md:text-[19px] lg:text-[21px] text-[rgba(255,255,255,0.7)] leading-relaxed max-w-[700px] mx-auto font-light">
              Mutuals+ is a platform for emerging and established
              creatives. Whether you&apos;re a musician, artist,
              designer, or storyteller—we want to hear from you.
            </p>

            {/* Stats */}
            {/* <div className="flex flex-wrap justify-center gap-8 md:gap-12 pt-8">
              <div className="text-center">
                <p className="text-[32px] md:text-[40px] text-white font-medium">
                  500+
                </p>
                <p className="text-[13px] text-[rgba(255,255,255,0.5)] uppercase tracking-[0.12em] font-medium">
                  Artists Featured
                </p>
              </div>
              <div className="text-center">
                <p className="text-[32px] md:text-[40px] text-white font-medium">
                  24h
                </p>
                <p className="text-[13px] text-[rgba(255,255,255,0.5)] uppercase tracking-[0.12em] font-medium">
                  Response Time
                </p>
              </div>
              <div className="text-center">
                <p className="text-[32px] md:text-[40px] text-white font-medium">
                  100%
                </p>
                <p className="text-[13px] text-[rgba(255,255,255,0.5)] uppercase tracking-[0.12em] font-medium">
                  Independent
                </p>
              </div>
            </div> */}
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="bg-[#050507] py-16 md:py-24 px-4 md:px-8 lg:px-16">
        <div className="max-w-[1000px] mx-auto">
          {/* Toggle Buttons */}
          <div className="flex gap-4 mb-12 justify-center">
            <button
              onClick={() => setSubmissionType('submit')}
              className={`px-6 py-3 rounded-sm transition-all ${
                submissionType === 'submit'
                  ? 'bg-white text-[#050507]'
                  : 'bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.15)] text-white hover:bg-[rgba(255,255,255,0.08)]'
              }`}>
              <span className="text-[13px] uppercase tracking-[0.12em] font-medium">
                Submit Work
              </span>
            </button>
            <button
              onClick={() => setSubmissionType('contact')}
              className={`px-6 py-3 rounded-sm transition-all ${
                submissionType === 'contact'
                  ? 'bg-white text-[#050507]'
                  : 'bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.15)] text-white hover:bg-[rgba(255,255,255,0.08)]'
              }`}>
              <span className="text-[13px] uppercase tracking-[0.12em] font-medium">
                Get In Touch
              </span>
            </button>
          </div>

          {/* Form Container */}
          <div className="relative overflow-hidden">
            <div className="relative z-10">
              {submissionType === 'submit' ? (
                <form
                  onSubmit={artistForm.handleSubmit(onArtistSubmit)}
                  className="space-y-8">
                  {/* Header */}
                  <div className="space-y-3 pb-6 border-b border-[rgba(255,255,255,0.08)]">
                    <h2 className="text-[28px] md:text-[36px] text-white tracking-[-0.02em] font-medium">
                      Submissions
                    </h2>
                    <p className="text-[15px] text-[rgba(255,255,255,0.6)] font-light">
                      Fill out the form below and we&apos;ll review
                      your submission within 24 hours. All submissions
                      are kept confidential.
                    </p>
                  </div>

                  {/* Category Selection */}
                  <div className="space-y-4">
                    <label className="block">
                      <span className="text-[13px] text-[rgba(255,255,255,0.7)] uppercase tracking-[0.12em] font-medium mb-4 block">
                        Category
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {categories.map((cat) => (
                          <button
                            key={cat.id}
                            type="button"
                            onClick={() => setCategory(cat.id)}
                            className={`text-left p-4 rounded-sm border transition-all ${
                              category === cat.id
                                ? 'bg-[rgba(255,255,255,0.08)] border-white'
                                : 'bg-[rgba(255,255,255,0.02)] border-[rgba(255,255,255,0.08)] hover:border-[rgba(255,255,255,0.15)]'
                            }`}>
                            <p className="text-[15px] text-white font-medium mb-1">
                              {cat.label}
                            </p>
                            <p className="text-[12px] text-[rgba(255,255,255,0.5)]">
                              {cat.description}
                            </p>
                          </button>
                        ))}
                      </div>
                    </label>
                  </div>

                  {/* Personal Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block">
                        <span className="text-[13px] text-[rgba(255,255,255,0.7)] uppercase tracking-[0.12em] font-medium mb-3 block">
                          Full Name *
                        </span>
                        <input
                          type="text"
                          {...artistForm.register('name')}
                          placeholder="Your name"
                          className="w-full bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.1)] rounded-sm px-4 py-3 text-white placeholder:text-[rgba(255,255,255,0.3)] focus:outline-none focus:border-[rgba(255,255,255,0.3)] transition-colors"
                        />
                        {artistForm.formState.errors.name && (
                          <p className="text-red-400 text-xs mt-1">
                            {artistForm.formState.errors.name.message}
                          </p>
                        )}
                      </label>
                    </div>
                    <div>
                      <label className="block">
                        <span className="text-[13px] text-[rgba(255,255,255,0.7)] uppercase tracking-[0.12em] font-medium mb-3 block">
                          Email *
                        </span>
                        <input
                          type="email"
                          {...artistForm.register('email')}
                          placeholder="your@email.com"
                          className="w-full bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.1)] rounded-sm px-4 py-3 text-white placeholder:text-[rgba(255,255,255,0.3)] focus:outline-none focus:border-[rgba(255,255,255,0.3)] transition-colors"
                        />
                        {artistForm.formState.errors.email && (
                          <p className="text-red-400 text-xs mt-1">
                            {
                              artistForm.formState.errors.email
                                .message
                            }
                          </p>
                        )}
                      </label>
                    </div>
                  </div>

                  {/* Social Links */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block">
                        <span className="text-[13px] text-[rgba(255,255,255,0.7)] uppercase tracking-[0.12em] font-medium mb-3 block">
                          Instagram Handle
                        </span>
                        <input
                          type="text"
                          {...artistForm.register('instagram')}
                          placeholder="@username"
                          className="w-full bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.1)] rounded-sm px-4 py-3 text-white placeholder:text-[rgba(255,255,255,0.3)] focus:outline-none focus:border-[rgba(255,255,255,0.3)] transition-colors"
                        />
                        {artistForm.formState.errors.instagram && (
                          <p className="text-red-400 text-xs mt-1">
                            {
                              artistForm.formState.errors.instagram
                                .message
                            }
                          </p>
                        )}
                      </label>
                    </div>
                    <div>
                      <label className="block">
                        <span className="text-[13px] text-[rgba(255,255,255,0.7)] uppercase tracking-[0.12em] font-medium mb-3 block">
                          Website / Portfolio
                        </span>
                        <input
                          type="url"
                          {...artistForm.register('portfolio')}
                          placeholder="https://"
                          className="w-full bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.1)] rounded-sm px-4 py-3 text-white placeholder:text-[rgba(255,255,255,0.3)] focus:outline-none focus:border-[rgba(255,255,255,0.3)] transition-colors"
                        />
                        {artistForm.formState.errors.portfolio && (
                          <p className="text-red-400 text-xs mt-1">
                            {
                              artistForm.formState.errors.portfolio
                                .message
                            }
                          </p>
                        )}
                      </label>
                    </div>
                  </div>

                  {/* Project Details */}
                  <div>
                    <label className="block">
                      <span className="text-[13px] text-[rgba(255,255,255,0.7)] uppercase tracking-[0.12em] font-medium mb-3 block">
                        Project Title *
                      </span>
                      <input
                        type="text"
                        {...artistForm.register('title')}
                        placeholder="Name of your work"
                        className="w-full bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.1)] rounded-sm px-4 py-3 text-white placeholder:text-[rgba(255,255,255,0.3)] focus:outline-none focus:border-[rgba(255,255,255,0.3)] transition-colors"
                      />
                      {artistForm.formState.errors.title && (
                        <p className="text-red-400 text-xs mt-1">
                          {artistForm.formState.errors.title.message}
                        </p>
                      )}
                    </label>
                  </div>

                  <div>
                    <label className="block">
                      <span className="text-[13px] text-[rgba(255,255,255,0.7)] uppercase tracking-[0.12em] font-medium mb-3 block">
                        Description *
                      </span>
                      <textarea
                        {...artistForm.register('description')}
                        rows={6}
                        placeholder="Tell us about your work, inspiration, and what makes it unique..."
                        className="w-full bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.1)] rounded-sm px-4 py-3 text-white placeholder:text-[rgba(255,255,255,0.3)] focus:outline-none focus:border-[rgba(255,255,255,0.3)] transition-colors resize-none"
                      />
                      {artistForm.formState.errors.description && (
                        <p className="text-red-400 text-xs mt-1">
                          {
                            artistForm.formState.errors.description
                              .message
                          }
                        </p>
                      )}
                    </label>
                  </div>

                  {/* File Upload */}
                  <div>
                    <label className="block">
                      <span className="text-[13px] text-[rgba(255,255,255,0.7)] uppercase tracking-[0.12em] font-medium mb-3 block">
                        Upload Files
                      </span>
                      <div className="relative">
                        <input
                          type="file"
                          multiple
                          onChange={handleFileChange}
                          className="hidden"
                          id="file-upload"
                          accept="image/*,video/*,audio/*,.pdf,.doc,.docx"
                        />
                        <label
                          htmlFor="file-upload"
                          className="flex flex-col items-center justify-center w-full h-[200px] border-2 border-dashed border-[rgba(255,255,255,0.15)] rounded-sm cursor-pointer hover:border-[rgba(255,255,255,0.3)] transition-colors bg-[rgba(255,255,255,0.02)]">
                          <Upload className="w-10 h-10 text-[rgba(255,255,255,0.4)] mb-3" />
                          <p className="text-[14px] text-[rgba(255,255,255,0.6)] mb-1">
                            Click to upload or drag and drop
                          </p>
                          <p className="text-[12px] text-[rgba(255,255,255,0.4)]">
                            Images, videos, audio, or PDF (Max 50MB
                            per file)
                          </p>
                        </label>
                      </div>

                      {/* File List */}
                      {files.length > 0 && (
                        <div className="mt-4 space-y-2">
                          {files.map((file, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-sm px-4 py-3">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-[rgba(255,255,255,0.1)] rounded-sm flex items-center justify-center">
                                  <Upload className="w-4 h-4 text-white" />
                                </div>
                                <div>
                                  <p className="text-[14px] text-white">
                                    {file.name}
                                  </p>
                                  <p className="text-[12px] text-[rgba(255,255,255,0.4)]">
                                    {(
                                      file.size /
                                      1024 /
                                      1024
                                    ).toFixed(2)}{' '}
                                    MB
                                  </p>
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={() => removeFile(index)}
                                className="text-[rgba(255,255,255,0.5)] hover:text-white transition-colors">
                                <X className="w-5 h-5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </label>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={isArtistLoading}
                      className="w-full md:w-auto bg-white hover:bg-[rgba(255,255,255,0.9)] transition-all rounded-sm px-10 py-4 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed">
                      <Send className="w-5 h-5 text-[#050507]" />
                      <span className="text-[13px] text-[#050507] uppercase tracking-[0.12em] font-medium">
                        {isArtistLoading
                          ? 'Submitting...'
                          : 'Submit for Review'}
                      </span>
                    </button>
                  </div>
                </form>
              ) : (
                <form
                  onSubmit={contactForm.handleSubmit(onContactSubmit)}
                  className="space-y-8">
                  {/* Header */}
                  <div className="space-y-3 pb-6 border-b border-[rgba(255,255,255,0.08)]">
                    <h2 className="text-[28px] md:text-[36px] text-white tracking-[-0.02em] font-medium">
                      Get In Touch
                    </h2>
                    <p className="text-[15px] text-[rgba(255,255,255,0.6)] font-light">
                      Have a question, partnership proposal, or just
                      want to say hello? We&apos;d love to hear from
                      you.
                    </p>
                  </div>

                  {/* Contact Form */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block">
                        <span className="text-[13px] text-[rgba(255,255,255,0.7)] uppercase tracking-[0.12em] font-medium mb-3 block">
                          Name *
                        </span>
                        <input
                          type="text"
                          {...contactForm.register('name')}
                          placeholder="Your name"
                          className="w-full bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.1)] rounded-sm px-4 py-3 text-white placeholder:text-[rgba(255,255,255,0.3)] focus:outline-none focus:border-[rgba(255,255,255,0.3)] transition-colors"
                        />
                        {contactForm.formState.errors.name && (
                          <p className="text-red-400 text-xs mt-1">
                            {
                              contactForm.formState.errors.name
                                .message
                            }
                          </p>
                        )}
                      </label>
                    </div>
                    <div>
                      <label className="block">
                        <span className="text-[13px] text-[rgba(255,255,255,0.7)] uppercase tracking-[0.12em] font-medium mb-3 block">
                          Email *
                        </span>
                        <input
                          type="email"
                          {...contactForm.register('email')}
                          placeholder="your@email.com"
                          className="w-full bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.1)] rounded-sm px-4 py-3 text-white placeholder:text-[rgba(255,255,255,0.3)] focus:outline-none focus:border-[rgba(255,255,255,0.3)] transition-colors"
                        />
                        {contactForm.formState.errors.email && (
                          <p className="text-red-400 text-xs mt-1">
                            {
                              contactForm.formState.errors.email
                                .message
                            }
                          </p>
                        )}
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block">
                      <span className="text-[13px] text-[rgba(255,255,255,0.7)] uppercase tracking-[0.12em] font-medium mb-3 block">
                        Subject *
                      </span>
                      <input
                        type="text"
                        {...contactForm.register('subject')}
                        placeholder="What's this about?"
                        className="w-full bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.1)] rounded-sm px-4 py-3 text-white placeholder:text-[rgba(255,255,255,0.3)] focus:outline-none focus:border-[rgba(255,255,255,0.3)] transition-colors"
                      />
                      {contactForm.formState.errors.subject && (
                        <p className="text-red-400 text-xs mt-1">
                          {
                            contactForm.formState.errors.subject
                              .message
                          }
                        </p>
                      )}
                    </label>
                  </div>

                  <div>
                    <label className="block">
                      <span className="text-[13px] text-[rgba(255,255,255,0.7)] uppercase tracking-[0.12em] font-medium mb-3 block">
                        Message *
                      </span>
                      <textarea
                        {...contactForm.register('message')}
                        rows={8}
                        placeholder="Tell us more..."
                        className="w-full bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.1)] rounded-sm px-4 py-3 text-white placeholder:text-[rgba(255,255,255,0.3)] focus:outline-none focus:border-[rgba(255,255,255,0.3)] transition-colors resize-none"
                      />
                      {contactForm.formState.errors.message && (
                        <p className="text-red-400 text-xs mt-1">
                          {
                            contactForm.formState.errors.message
                              .message
                          }
                        </p>
                      )}
                    </label>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={isContactLoading}
                      className="w-full md:w-auto bg-white hover:bg-[rgba(255,255,255,0.9)] transition-all rounded-sm px-10 py-4 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed">
                      <Send className="w-5 h-5 text-[#050507]" />
                      <span className="text-[13px] text-[#050507] uppercase tracking-[0.12em] font-medium">
                        {isContactLoading
                          ? 'Sending...'
                          : 'Send Message'}
                      </span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>

          {/* Success Message */}
          {isSubmitted && (
            <div className="mt-6 bg-[rgba(30,203,225,0.1)] border border-[rgba(30,203,225,0.3)] rounded-sm p-6 flex items-center gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <CheckCircle2 className="w-6 h-6 text-[#1ecbe1] shrink-0" />
              <div>
                <p className="text-white font-medium mb-1">
                  {submissionType === 'submit'
                    ? 'Submission Received!'
                    : 'Message Sent!'}
                </p>
                <p className="text-[14px] text-[rgba(255,255,255,0.7)]">
                  {submissionType === 'submit'
                    ? "Thank you! We'll review your submission and get back to you within 24 hours."
                    : "Thank you for reaching out! We'll get back to you as soon as possible."}
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* FAQ / Guidelines Section */}
      <section className="bg-[#0a0a0f] py-16 md:py-24 px-4 md:px-8 lg:px-16">
        <div className="max-w-[1000px] mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-[28px] md:text-[36px] text-white tracking-[-0.02em] font-medium mb-4">
              Submission Guidelines
            </h3>
            <p className="text-[15px] text-[rgba(255,255,255,0.6)] font-light max-w-[700px] mx-auto">
              Quick tips to help your submission stand out
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                title: 'Quality Matters',
                description:
                  'Submit your best, most polished work. High-resolution images and well-produced audio make a difference.',
              },
              {
                title: 'Be Original',
                description:
                  "We're looking for unique voices and fresh perspectives. Show us what makes your work distinctive.",
              },
              {
                title: 'Context is Key',
                description:
                  'Tell us the story behind your work. What inspired it? What are you trying to communicate?',
              },
              {
                title: 'Stay Connected',
                description:
                  'Include your social media and website so we can learn more about you and your practice.',
              },
            ].map((item, index) => (
              <div
                key={index}
                className="bg-[#050507] border border-[rgba(255,255,255,0.08)] rounded-sm p-6 hover:border-[rgba(255,255,255,0.15)] transition-all">
                <h4 className="text-[18px] text-white font-medium mb-2">
                  {item.title}
                </h4>
                <p className="text-[14px] text-[rgba(255,255,255,0.6)] leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
