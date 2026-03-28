import { useEffect, useState } from "react";
import { Send } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { useAuth } from "@/contexts/AuthContext";
import type { TicketComment } from "@/types/models";

interface TicketCommentsSectionProps {
  initialComments: TicketComment[];
  onSend?: (payload: { message: string; internal: boolean }) => Promise<void> | void;
}

export function TicketCommentsSection({ initialComments, onSend }: TicketCommentsSectionProps) {
  const { user } = useAuth();
  const [comments, setComments] = useState(initialComments);
  const [draft, setDraft] = useState("");
  const [internal, setInternal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    setComments(initialComments);
  }, [initialComments]);

  async function handleSend() {
    const message = draft.trim();

    if (!message) {
      setSubmitError("Add a reply or note before sending.");
      return;
    }

    if (submitting) {
      return;
    }

    const nextComment = {
      id: `comment-${comments.length + 1}`,
      authorId: user?.id ?? "unknown",
      authorName: user?.name ?? "SupportOps User",
      authorInitials: user?.initials ?? "SO",
      message,
      createdAt: "Just now",
      internal,
    };

    const previousComments = comments;
    setComments([...comments, nextComment]);
    setSubmitting(true);
    setSubmitError("");

    try {
      if (onSend) {
        await onSend({ message, internal });
      }

      setDraft("");
      setInternal(false);
    } catch (error) {
      setComments(previousComments);
      setSubmitError(error instanceof Error ? error.message : "Unable to send comment.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="panel p-6">
      <div className="mb-5">
        <p className="text-sm font-semibold text-slate-900">Comments</p>
        <p className="mt-1 text-sm text-slate-500">Reply to the customer or leave an internal note for the support team.</p>
      </div>

      <div className="space-y-4">
        {comments.map((comment) => {
          const isInternal = comment.internal;

          return (
            <div
              key={comment.id}
              className={`rounded-3xl border px-5 py-4 ${
                isInternal ? "border-violet-100 bg-violet-50/60" : "border-slate-100 bg-white"
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-950 text-xs font-bold text-white">
                    {comment.authorInitials ?? "SO"}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{comment.authorName ?? "SupportOps User"}</p>
                    <p className="mt-1 text-sm text-slate-500">{comment.createdAt}</p>
                  </div>
                </div>
                <Badge tone={isInternal ? "neutral" : "success"}>{isInternal ? "Internal note" : "Public reply"}</Badge>
              </div>
              <p className="mt-4 text-sm leading-7 text-slate-600">{comment.message}</p>
            </div>
          );
        })}
      </div>

      <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-50/70 p-4">
        {submitError ? <div className="mb-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{submitError}</div> : null}
        <textarea
          value={draft}
          onChange={(event) => {
            setDraft(event.target.value);
            setSubmitError("");
          }}
          rows={4}
          placeholder={internal ? "Add an internal note for your team" : "Write a reply to the customer"}
          disabled={submitting}
          className="w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-300 disabled:cursor-not-allowed disabled:bg-slate-100"
        />
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <label className="inline-flex items-center gap-3 text-sm font-medium text-slate-700">
            <button
              type="button"
              onClick={() => setInternal((value) => !value)}
              disabled={submitting}
              className={`relative inline-flex h-7 w-12 items-center rounded-full transition ${
                internal ? "bg-slate-950" : "bg-slate-300"
              }`}
              aria-pressed={internal}
            >
              <span
                className={`inline-block h-5 w-5 rounded-full bg-white transition ${internal ? "translate-x-6" : "translate-x-1"}`}
              />
            </button>
            Internal note
          </label>
          <button
            type="button"
            onClick={handleSend}
            disabled={submitting}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            <Send className="h-4 w-4" />
            {submitting ? "Sending..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
}
